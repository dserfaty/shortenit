import ShortUrl, {IShortUrl} from "../models/shortUrl";
import {DUPLICATE_URL_ERROR, INTERNAL_SERVER_ERROR, InternalErrorCode} from "../controllers/internalErrorCodes";
import {DatabaseUpdateResult} from "./servicesUtils";
import {createSlug} from "./slugService";
import logger from "./logger";

export async function getShortUrlById(id: string): Promise<IShortUrl | null | undefined> {
    try {
        const url = await ShortUrl.findById(id);
        // console.log(url);
        if (!url) {
            return null;
        } else {
            return url;
        }
    } catch (error) {
        logger.error('An error occurred:', error);
    }
}

export async function getShortUrlBySlug(slug: string): Promise<IShortUrl | null | undefined> {
    try {
        const url = await ShortUrl.findOne({slug: slug});
        // console.log(url);
        if (!url) {
            return null;
        } else {
            return url;
        }
    } catch (error) {
        logger.error('An error occurred:', error);
    }
}

export async function incrementVisits(id: string): Promise<number | null | undefined> {
    try {
        const result = await ShortUrl.findByIdAndUpdate(id, {$inc: {'visits': 1}});
        console.log(result);
        if (!result) {
            return 0;
        } else {
            return result.visits;
        }
    } catch (error) {
        logger.error('An error occurred:', error);
    }
}

export async function createUrl(url: String, uid: string | null, visits: number, date: Date): Promise<DatabaseUpdateResult<IShortUrl>> {
    try {
        const slug = createSlug();
        // TODO: here we could quickly verify or handle the extremely rare collision cases
        //       for now if it happened, the service would fail on insertion and the user would have
        //       to try again
        const shortUrl = new ShortUrl({
            url: url,
            uid: uid,
            slug: slug,
            visits: visits,
            createdOn: date,
            updatedOn: date
        });
        return await shortUrl.save().then(
            doc => new DatabaseUpdateResult<IShortUrl>(doc, null)
        );
    } catch (error) {
        // console.error('An error occurred:', error);
        return new DatabaseUpdateResult<IShortUrl>(null, internalDatabaseError(error));
    }
}

export async function getMostPopularByUid(uid: string, limit: number): Promise<IShortUrl[] | null | undefined> {
    try {
        const urls =
            await ShortUrl.find({uid: uid})
                .sort({visits: -1, createdOn: -1})
                .limit(limit);
        // console.log(url);
        if (!urls) {
            return null;
        } else {
            return urls;
        }
    } catch (error) {
        logger.error('An error occurred:', error);
    }
}

function internalDatabaseError(error: any): InternalErrorCode {
    if (error.code === 11000) {
        return DUPLICATE_URL_ERROR;
    } else {
        logger.error("Mongo Error: ", error);
        return INTERNAL_SERVER_ERROR;
    }
}


