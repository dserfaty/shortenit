import ShortUrl, {IShortUrl} from "../models/shortUrl";
import {DUPLICATE_URL_ERROR, INTERNAL_SERVER_ERROR, InternalErrorCode} from "../controllers/internalErrorCodes";
import {DatabaseUpdateResult} from "./servicesUtils";

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
        console.error('An error occurred:', error);
    }
}

export async function getUrlById(id: string): Promise<string | null | undefined> {
    try {
        const url = await ShortUrl.findById(id);
        // console.log(url);
        if (!url) {
            return null;
        } else {
            return url.url;
        }
    } catch (error) {
        console.error('An error occurred:', error);
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
        console.error('An error occurred:', error);
    }
}

export async function createUrl(url: String, uid: string | null, visits: number, date: Date): Promise<DatabaseUpdateResult<IShortUrl>> {
    try {
        const shortUrl = new ShortUrl({
            url: url,
            uid: uid,
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

function internalDatabaseError(error: any): InternalErrorCode {
    if (error.code === 11000) {
        return DUPLICATE_URL_ERROR;
    } else {
        console.error("Mongo Error: ", error)
        return INTERNAL_SERVER_ERROR;
    }
}


