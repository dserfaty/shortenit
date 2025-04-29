import {DUPLICATE_URL_ERROR, INTERNAL_SERVER_ERROR, InternalErrorCode} from "../controllers/internalErrorCodes";
import bcrypt from 'bcrypt';

export class DatabaseUpdateResult<T> {
    result: T | null;
    error: InternalErrorCode | null;

    public constructor(result: T | null, error: InternalErrorCode | null) {
        this.result = result;
        this.error = error;
    }

    public isError(): boolean {
        return this.error != null;
    }
}

const SALT_ROUNDS = 10;
export function hashPassword(password: string): string | null {
    // TODO: should be async but it will do for a demo as it is called infrequently
    return bcrypt.hashSync(password, SALT_ROUNDS);
}