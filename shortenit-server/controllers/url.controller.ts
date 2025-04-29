import {Request, Response} from "express";
import {getUrlById, getShortUrlById, incrementVisits, createUrl} from "../services/urlService"
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
 * @param req express request
 * @param res express response
 */
export async function redirectTo(req: Request, res: Response) {
    const id: string = req.params.id;
    if (!isValidUrlId(id)) {
        returnPageNotFoundError(res);
    }

    const url = await getUrlById(id);
    if (url) {
        await incrementVisits(id);
        // TODO: check what is returned from the database - can it be null | undefined?
        // redirect whatever the result of incrementVisits is
        res.redirect(url);
    } else {
        returnPageNotFoundError(res);
    }
}

/**
 * Returns the Short URL entry as json
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
                            url: doc.url,
                            shortUrl: `${redirectBaseURL}/r/${id}`,
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
                                    shortUrl: `${redirectBaseURL}/r/${id}`,
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