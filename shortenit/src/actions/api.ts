import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
export type ShortUrl = {
    id: string;
    url: string;
    shortUrl: string;
    uid: string | null;
    visits: number;
    createdOn: Date;
    updatedOn: Date;
};

export type APIAccount = {
    id: string;
    userName: string,
    createdOn: Date;
    updatedOn: Date;
}

export type APIToken = {
    account: APIAccount;
    token: string;
};

export class APIError {
    error: string;
    code: string;

    constructor(error: string, code: string) {
        this.error = error;
        this.code = code;
    }
}

function noAuthHeaders(): any {
    return {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    }
}

function authenticatedHeaders(token: string): any {
    return {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }
}

export async function createToken(userName: string, password: string): Promise<APIToken | APIError> {
    try {
        const callUrl = `${API_BASE_URL}/api/accounts/tokens`;
        const {data, status} = await axios.post<APIToken>(
            callUrl,
            {userName: userName, password: password},
            noAuthHeaders()
        );

        console.log(`=== API Call to: ${callUrl} - result:`);
        console.log(JSON.stringify(data, null, 4));
        console.log('status: ', status);

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // console.log('error message: ', error.message);
            return error.response ? error.response.data as APIError : new APIError(error.message, "");
        } else {
            console.log('unexpected error: ', error);
            return new APIError("An unexpected error occurred", "");
        }
    }
}

export async function getShortUrl(slug: string, token: string): Promise<ShortUrl | APIError> {
    try {
        const callUrl = `${API_BASE_URL}/api/urls/${slug}`;
        // console.log("url", url);

        const {data, status} = await axios.get<ShortUrl>(
            callUrl,
            authenticatedHeaders(token)
        );

        console.log(`=== API Call to: ${callUrl} - result:`);
        console.log(JSON.stringify(data, null, 4));
        console.log('status: ', status);

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // console.log('error message: ', error.message);
            return error.response ? error.response.data as APIError : new APIError(error.message, "");
        } else {
            console.log('unexpected error: ', error);
            return new APIError("An unexpected error occurred", "");
        }
    }
}

export async function createShortUrl(url: string, token: string): Promise<ShortUrl | APIError> {
    try {
        // console.log(`=== API createShortURL, url: ${url}, token: ${token}`);

        const callUrl = `${API_BASE_URL}/api/urls`;
        const {data} = await axios.post<ShortUrl>(
            callUrl,
            {url: url},
            authenticatedHeaders(token)
        );

        // console.log(`API Call to: ${callUrl} and token: ${token} result:`);
        // console.log(JSON.stringify(data, null, 4));
        // console.log('status: ', status);

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // console.log('error message: ', error.message);
            return error.response ? error.response.data as APIError : new APIError(error.message, "");
        } else {
            console.log('unexpected error: ', error);
            return new APIError("An unexpected error occurred", "");
        }
    }
}


/*
    TODO: calls needed:
        - get all urls (?userId=xxx) - if no user id return for all users otherwise only for the current user
        - post new url

 */

