import {Request} from "express";
import {IAccount, ICreateToken} from "../models/accounts";
import {
    ACCOUNT_NOT_FOUND_ERROR,
    CREATE_ACCOUNT_ERROR,
    InternalErrorCode, INVALID_CREDENTIALS,
    INVALID_PASSWORD_ERROR,
    INVALID_USERNAME_ERROR
} from "./internalErrorCodes";
import mongoose, {Document} from "mongoose";
import {JwtPayload} from "jsonwebtoken";
import {decodeJWT} from "../services/jwtService";
import {getAccountById} from "../services/accountService";
import logger from '../services/logger';

// borrowed from: https://dev.to/fromwentzitcame/username-and-password-validation-using-regex-2175
// anything NOT alphanumeric, correct length (6-16)
const usernameRegex = /^[0-9A-Za-z]{5,16}$/;

// at least one number, at least one letter, correct length (8-32)
const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/;

export function validateNewAccount(req: Request, date: Date): IAccount | InternalErrorCode {
    const body = req.body;
    if (!isValidUserName(body.userName)) {
        return INVALID_USERNAME_ERROR;
    }
    if (!isValidPassword(body.password)) {
        return INVALID_PASSWORD_ERROR;
    }
    if (!date) {
        return CREATE_ACCOUNT_ERROR;
    }

    return {
        userName: body.userName,
        password: body.password,
        createdOn: date,
        updatedOn: date
    } as IAccount;
}

export function validateCreateToken(req: Request): ICreateToken | InternalErrorCode {
    const body = req.body;
    if (!isValidUserName(body.userName)) {
        return INVALID_USERNAME_ERROR;
    }

    return {
        userName: body.userName,
        password: body.password
    } as ICreateToken;
}

export function isValidUserName(userName: string) {
    return usernameRegex.test(userName);
}

export function isValidPassword(password: string) {
    return passwordRegex.test(password);
}

export function isValidAccountId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id); //true
}

export interface IAuthenticatedUser extends Document {
    account: IAccount;
    token: string;
    decodedToken: JwtPayload
}

export async function authenticate(req: Request): Promise<IAuthenticatedUser | InternalErrorCode> {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return INVALID_CREDENTIALS;
        } else {
            const decodedToken = decodeJWT(token) as JwtPayload;
            // console.log("decodedToken: " + decodedToken);
            const id = decodedToken._id;
            return await getAccountById(id).then(account => {
                if (account === null) {
                    return ACCOUNT_NOT_FOUND_ERROR;
                } else {
                    const result = {
                        account: account as IAccount,
                        token: token,
                        decodedToken: decodedToken
                    } as IAuthenticatedUser;

                    return result;
                }
            }).catch(error => {
                logger.error(`Error loading the account for id: ${id}`, error)
                return INVALID_CREDENTIALS;
            });
        }
    } catch (error) {
        return INVALID_CREDENTIALS;
    }
}