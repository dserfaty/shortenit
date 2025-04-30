import {Request, Response} from "express";
import {
    getShortUrlBySlug,
    getShortUrlById,
    incrementVisits,
    createUrl,
    getMostPopularByUid
} from "../services/urlService"
import {returnControllerError, returnPageNotFoundError} from "./errorsUtils";
import {
    BAD_URL_ERROR,
    INTERNAL_SERVER_ERROR,
    InternalErrorCode,
    INVALID_PERMISSIONS,
    URL_NOT_FOUND_ERROR
} from "./internalErrorCodes";
import {isValidURL, isValidUrlId} from "./urlUtils";
import {authenticate, IAuthenticatedUser} from "./accountUtils";
import {isValidSlug} from "../services/slugService";

/**
 * Home path of the api - description
 * @param req express request
 * @param res express response
 */
export async function home(req: Request, res: Response) {
    res.json({message: "Welcome to Shorten It API."});
}

/**
 * Fetches the url object and redirects the response to it - this would typically be
 * used in a browser
 * or a standard json error if not successful
 * input: slug as a path parameter
 * @param req express request
 * @param res express response
 */
export async function redirectTo(req: Request, res: Response) {
    const slug: string = req.params.slug;
    if (!isValidSlug(slug)) {
        returnPageNotFoundError(res);
    } else {
        const url = await getShortUrlBySlug(slug);
        if (url) {
            await incrementVisits(url.id);
            // redirect whatever the result of incrementVisits is
            const fullUrl = url.url;
            res.redirect(fullUrl);
        } else {
            returnPageNotFoundError(res);
        }
    }
}

/**
 * Returns the Short URL entry as json
 * {
 *   id: internal id
 *   url: string; full url
 *   uid: string; uid of the owner
 *   slug: string; slug
 *   shortUrl: full short url
 *   visits: number;
 *   createdOn: Date;
 *   updatedOn: Date;
 * }
 * or a standard json error if not successful
 * @param req express request
 * @param res express response
 */
export async function getShortUrl(req: Request, res: Response) {
    const id: string = req.params.id;
    if (!isValidUrlId(id)) {
        returnPageNotFoundError(res);
    }

    await authenticate(req).then(async authResult => {
        if (authResult instanceof InternalErrorCode) {
            returnControllerError(authResult, res);
        } else {
            const redirectBaseURL = process.env.REDIRECT_BASE_URL as string;
            await getShortUrlById(id).then(doc => {
                console.log('Document loaded:', doc)
                if (doc === null || doc === undefined) {
                    returnControllerError(URL_NOT_FOUND_ERROR, res);
                } else {
                    const docId = doc.id as string;
                    res.json({
                            id: docId,
                            uid: doc.uid,
                            url: doc.url,
                            slug: doc.slug,
                            shortUrl: `${redirectBaseURL}/r/${doc.slug}`,
                            visits: doc.visits,
                            createdOn: doc.createdOn,
                            updatedOn: doc.updatedOn
                        }
                    );
                }
            }).catch(err => {
                console.error('Could not load url - error:', err)
                returnPageNotFoundError(res);
            });
        }
    }).catch(err => {
        console.error('Authorization error:', err)
        returnControllerError(INVALID_PERMISSIONS, res);
    });
}

interface ShortURLJson {
    id: string;
    url: string;
    uid: string | null;
    slug: string,
    shortUrl: string;
    visits: number;
    createdOn: Date;
    updatedOn: Date;
}

interface PopularURLJson {
    urls: ShortURLJson[]
}

/**
 * Returns a list of Short URL entries as json sorted descending by most visits and creation date
 * {
 *   urls: [
 *      {
 *          id: internal id
 *          url: string;
 *          uid: string;
 *          slug: string,
 *          shortUrl: string,
 *          visits: number;
 *          createdOn: Date;
 *          updatedOn: Date;
 *      },
 *      ...
 *   ]
 * }
 * or a standard json error if not successful
 * @param req express request
 * @param res express response
 */
export async function getPopularUrls(req: Request, res: Response) {
    await authenticate(req).then(async authResult => {
        if (authResult instanceof InternalErrorCode) {
            returnControllerError(authResult, res);
        } else {
            const uid = authResult.account.id;
            const redirectBaseURL = process.env.REDIRECT_BASE_URL as string;
            await getMostPopularByUid(uid, 10).then(urls => {
                console.log('Document loaded:', urls)
                let result: ShortURLJson[] = [];
                if (urls !== null && urls !== undefined && urls.length > 0) {
                    result = urls.map((doc) => {
                            const docId = doc.id as string;
                            return {
                                id: docId,
                                uid: doc.uid,
                                url: doc.url,
                                slug: doc.slug,
                                shortUrl: `${redirectBaseURL}/r/${doc.slug}`,
                                visits: doc.visits,
                                createdOn: doc.createdOn,
                                updatedOn: doc.updatedOn
                            } as ShortURLJson
                        }
                    );
                }
                const json = {
                    urls: result
                } as PopularURLJson
                res.json(json);
            }).catch(err => {
                console.error('Could not load url - error:', err)
                returnPageNotFoundError(res);
            });
        }
    }).catch(err => {
        console.error('Authorization error:', err)
        returnControllerError(INVALID_PERMISSIONS, res);
    });
}

/**
 * Creates a new Short URL entry and returns the following json if successful
 * {
 *   url: string;
 *   uid: string;
 *   visits: number;
 *   createdOn: Date;
 *   updatedOn: Date;
 * }
 * or a standard json error if not successful
 * @param req express request
 * @param res express response
 */
export async function createShortUrl(req: Request, res: Response) {
    const requestData = req.body;
    // console.log(`got data: `, requestData.url)

    const redirectBaseURL = process.env.REDIRECT_BASE_URL as string;
    const now = new Date();
    const url = requestData.url;

    await authenticate(req).then(async authResult => {
        if (authResult instanceof InternalErrorCode) {
            returnControllerError(authResult, res);
        } else {
            const authAccount = authResult as IAuthenticatedUser;
            if (!isValidURL(url)) {
                returnControllerError(BAD_URL_ERROR, res);
            } else {
                await createUrl(url, authAccount.account.id, 0, now)
                    .then(result => {
                        if (!result.isError() && result.result != null) {
                            const doc = result.result;
                            console.log('Document saved:', result.result)
                            const id = result.result.id as string;

                            res.json({
                                    id: id,
                                    url: url,
                                    shortUrl: `${redirectBaseURL}/r/${doc.slug}`,
                                    visits: doc.visits,
                                    createdOn: doc.createdOn,
                                    updatedOn: doc.updatedOn
                                }
                            );
                        } else {
                            if (result.error == null) {
                                returnControllerError(INTERNAL_SERVER_ERROR, res);
                            } else {
                                returnControllerError(result.error, res);
                            }
                        }
                    }).catch(err => {
                        returnControllerError(INTERNAL_SERVER_ERROR, err);
                    });
            }
        }
    }).catch(err => {
        console.error('Authorization error:', err)
        returnControllerError(INVALID_PERMISSIONS, res);
    });
}