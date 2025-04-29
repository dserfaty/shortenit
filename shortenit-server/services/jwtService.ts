import {IAccount} from "../models/accounts";
import jwt, {JwtPayload} from "jsonwebtoken";

export function makeJWT(account: IAccount): string {
    const SECRET_KEY = process.env.JWT_SECRET as string;
    return jwt.sign({
        _id: account._id?.toString(),
        name: account.userName
    }, SECRET_KEY, {
        expiresIn: '30 days',
    });
}

export function decodeJWT(token: string): string | JwtPayload {
    const SECRET_KEY = process.env.JWT_SECRET as string;
    return jwt.verify(token, SECRET_KEY);
}