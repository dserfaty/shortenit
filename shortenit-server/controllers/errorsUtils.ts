import {Response} from "express";
import {InternalErrorCode} from "./internalErrorCodes";
import {StatusCodes} from "http-status-codes";

export function returnControllerError(error: InternalErrorCode, res: Response) {
    res.status(error.status).json({
            error: error.errorMessage,
            code: error.internalCode
        }
    )
}

export function returnGeneralControllerError(
    status: number, error: string, internalErrorCode: string, res: Response) {
    res.status(status).json({
            error: error,
            code: internalErrorCode
        }
    )
}

export function returnPageNotFoundError(res: Response) {
    res.status(StatusCodes.NOT_FOUND).send("<h1>Shorten It! The requested URL was not found!</h1>");
}