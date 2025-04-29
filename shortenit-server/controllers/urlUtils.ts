import mongoose from "mongoose";

export function isValidURL(urlString: string): boolean {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
}

export function isValidUrlId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id); //true
}