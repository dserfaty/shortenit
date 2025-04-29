import {StatusCodes} from "http-status-codes";

export class InternalErrorCode {
    status: number;
    internalCode: string;
    errorMessage: string;

    constructor(status: number, internalCode: string, errorMessage: string) {
        this.status = status;
        this.internalCode = internalCode;
        this.errorMessage = errorMessage;
    }
}

// Authentication/Authorization Errors
export const INVALID_CREDENTIALS = new InternalErrorCode(
    StatusCodes.UNAUTHORIZED,
    "INVALID_CREDENTIALS",
    'Authentication failed. Please provide valid credentials.'
);

export const INVALID_PERMISSIONS = new InternalErrorCode(
    StatusCodes.FORBIDDEN,
    "INVALID_PERMISSIONS",
    'The user does not have the right permissions for this call'
);

// URLs
export const BAD_URL_ERROR = new InternalErrorCode(
    StatusCodes.BAD_REQUEST,
    "BAD_URL_ERROR",
    'The url is not a valid url'
);

export const DUPLICATE_URL_ERROR = new InternalErrorCode(
    StatusCodes.BAD_REQUEST,
    "DUPLICATE_URL_ERROR",
    'A duplicate URL already exists in your account'
);

export const URL_NOT_FOUND_ERROR = new InternalErrorCode(
    StatusCodes.NOT_FOUND,
    "URL_NOT_FOUND_ERROR",
    'URL not found'
);

// Accounts
export const ACCOUNT_NOT_FOUND_ERROR = new InternalErrorCode(
    StatusCodes.NOT_FOUND,
    "ACCOUNT_NOT_FOUND_ERROR",
    'Account does not exist'
);

export const CREATE_ACCOUNT_ERROR = new InternalErrorCode(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "CREATE_ACCOUNT_ERROR",
    'Error while creating the account - Please try again later'
);

export const DUPLICATE_USERNAME_ERROR = new InternalErrorCode(
    StatusCodes.BAD_REQUEST,
    "DUPLICATE_USERNAME_ERROR",
    'An account with the same user name already exists in the system'
);

export const INVALID_PASSWORD_ERROR = new InternalErrorCode(
    StatusCodes.BAD_REQUEST,
    "INVALID_PASSWORD_ERROR",
    'The password is not valid (at least one number, at least one letter, length: 8-32)'
);

export const INVALID_USERNAME_ERROR = new InternalErrorCode(
    StatusCodes.BAD_REQUEST,
    "INVALID_USERNAME_ERROR",
    'The user name is not valid (Should be alphanumeric, length: 5-16)'
);

// General Errors
export const INTERNAL_SERVER_ERROR = new InternalErrorCode(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "INTERNAL_SERVER_ERROR",
    'The request could not be completed due to some internal error - Please try again later'
);