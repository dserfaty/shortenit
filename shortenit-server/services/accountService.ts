import Account from "../models/accounts";
import {
    CREATE_ACCOUNT_ERROR,
    DUPLICATE_USERNAME_ERROR,
    INTERNAL_SERVER_ERROR,
    InternalErrorCode
} from "../controllers/internalErrorCodes";
import {DatabaseUpdateResult, hashPassword} from "./servicesUtils";
import {IAccount} from "../models/accounts";
import logger from "./logger";

export async function getAccountById(id: string): Promise<IAccount | null> {
    try {
        const account = await Account.findById(id);
        // console.log(url);
        if (!account) {
            return null;
        } else {
            return account;
        }
    } catch (error) {
        logger.error('An error occurred:', error);
        return null;
    }
}

export async function getAccountByUserName(userName: string): Promise<IAccount | null> {
    try {
        const account = await Account.findOne({ userName: userName });
        // console.log("account: ", account);
        if (!account) {
            return null;
        } else {
            return account;
        }
    } catch (error) {
        logger.error('An error occurred:', error);
        return null;
    }
}

export async function addNewAccount(newAccount: IAccount): Promise<DatabaseUpdateResult<IAccount>> {
    try {
        const hashedPassword = hashPassword(newAccount.password);
        if (hashedPassword) {
            const account = new Account({
                userName: newAccount.userName,
                password: hashedPassword,
                createdOn: newAccount.createdOn,
                updatedOn: newAccount.updatedOn
            });
            return await account.save().then(
                doc => new DatabaseUpdateResult<IAccount>(doc, null)
            );
        } else {
            logger.error('Could not create account (hash password failed)');
            return new DatabaseUpdateResult<IAccount>(null, CREATE_ACCOUNT_ERROR);
        }
    } catch (error) {
        logger.error('An error occurred:', error);
        return new DatabaseUpdateResult<IAccount>(null, internalDatabaseError(error));
    }
}

function internalDatabaseError(error: any): InternalErrorCode {
    logger.error("Mongo Error: ", error);
    if (error.code === 11000) {
        return DUPLICATE_USERNAME_ERROR;
    } else {
        return INTERNAL_SERVER_ERROR;
    }
}

