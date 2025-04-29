import {Request, Response} from "express";
import {
    authenticate,
    IAuthenticatedUser,
    isValidAccountId,
    validateCreateToken,
    validateNewAccount
} from "./accountUtils";
import {
    ACCOUNT_NOT_FOUND_ERROR,
    INTERNAL_SERVER_ERROR,
    InternalErrorCode,
    INVALID_CREDENTIALS, INVALID_PERMISSIONS
} from "./internalErrorCodes";
import {returnControllerError} from "./errorsUtils";
import {addNewAccount, getAccountById, getAccountByUserName} from "../services/accountService";
import {IAccount, ICreateToken} from "../models/accounts";
import bcrypt from "bcrypt";
import {makeJWT} from "../services/jwtService";

/**
 * Returns account id with the following json if successful
 * The authenticated user must be the owner of the account
 * {
 *   id: string;
 *   userName: string;
 *   createdOn: Date;
 *   updatedOn: Date;
 * }
 * or a standard json error if not successful
 * @param req express request
 * @param res express response
 */
export async function getAccount(req: Request, res: Response) {
    const id: string = req.params.id;
    if (!isValidAccountId(id)) {
        returnControllerError(ACCOUNT_NOT_FOUND_ERROR, res);
    }
    await authenticate(req).then(async authResult => {
        if (authResult instanceof InternalErrorCode) {
            returnControllerError(authResult, res);
        } else {
            const authAccount = authResult as IAuthenticatedUser;
            if (id !== authAccount.account.id) {
                // for now only return the info if the authenticated user is the requested id
                returnControllerError(INVALID_PERMISSIONS, res);
            } else {
                await getAccountById(id).then(loadedAccount => {
                    // console.log('Account loaded:', loadedAccount, account)
                    if (loadedAccount === null) {
                        returnControllerError(ACCOUNT_NOT_FOUND_ERROR, res);
                    } else {
                        const docId = loadedAccount.id as string;
                        res.json({
                                id: docId,
                                userName: loadedAccount.userName,
                                createdOn: loadedAccount.createdOn,
                                updatedOn: loadedAccount.updatedOn
                            }
                        );
                    }
                }).catch(err => {
                    console.error('Account not found:', err)
                    returnControllerError(ACCOUNT_NOT_FOUND_ERROR, res);
                });
            }
        }
    }).catch(err => {
        console.error('Authorization error:', err)
        returnControllerError(INVALID_PERMISSIONS, res);
    });
}

/**
 * Creates a new Account and returns the following json if successful
 * payload:
 * {
 *   userName: string;
 *   password: string;
 * }
 *
 * No authentication required
 * {
 *   id: string;
 *   userName: string;
 *   createdOn: Date;
 *   updatedOn: Date;
 * }
 * or a standard json error if not successful
 * @param req express request
 * @param res express response
 */
export async function createAccount(req: Request, res: Response) {
    const requestData = req.body;
    console.log(`got data: `, requestData.url)

    const now = new Date();
    const validationResult = validateNewAccount(req, now);

    if (validationResult instanceof InternalErrorCode) {
        returnControllerError(validationResult as InternalErrorCode, res);
    } else {
        const validatedNewAccount = validationResult as IAccount;
        await addNewAccount(validatedNewAccount).then(
            result => {
                if (!result.isError() && result.result != null) {
                    const doc = result.result;
                    console.log('New account saved:', doc)
                    const id = doc.id as string;

                    res.json({
                            id: id,
                            userName: doc.userName,
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
            }
        ).catch(err => {
            returnControllerError(INTERNAL_SERVER_ERROR, err);
        });
    }
}

/**
 * Creates a new JWT token
 * payload:
 * {
 *   userName: string;
 *   password: string;
 * }
 *
 * No authentication required
 * {
 *   id: string;
 *   userName: string;
 *   fullName: string;
 *   createdOn: Date;
 *   updatedOn: Date;
 * }
 * or a standard json error if not successful
 * @param req express request
 * @param res express response
 */
export async function createToken(req: Request, res: Response) {
    const requestData = req.body;
    // console.log(`got data: `, requestData)
    const validationResult = validateCreateToken(req);

    if (validationResult instanceof InternalErrorCode) {
        returnControllerError(validationResult as InternalErrorCode, res);
    } else {
        const createTokenPayload = validationResult as ICreateToken;

        await getAccountByUserName(createTokenPayload.userName).then(
            account => {
                if (account != null) {
                    const hash = account.password;
                    if (bcrypt.compareSync(createTokenPayload.password, account.password)) {
                        const token = makeJWT(account);
                        res.json({
                            account: {
                                id: account.id,
                                userName: account.userName,
                                createdOn: account.createdOn,
                                updatedOn: account.updatedOn
                            },
                            token: token
                        });
                    } else {
                        returnControllerError(INVALID_CREDENTIALS, res);
                    }
                } else {
                    returnControllerError(INVALID_CREDENTIALS, res); // Do not give any hint that the account does not exist
                }
            }
        ).catch(err => {
            returnControllerError(INVALID_CREDENTIALS, res);
        });
    }
}