export function isValidURL(urlString: string): boolean {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
}

// anything NOT alphanumeric, correct length (6-16)
const usernameRegex = /^[0-9A-Za-z]{5,16}$/;

// at least one number, at least one letter, correct length (8-32)
const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/;

export function isValidUserName(urlString: string): boolean {
    return usernameRegex.test(urlString);
}

export function isValidPassword(password: string): boolean {
    return passwordRegex.test(password);
}