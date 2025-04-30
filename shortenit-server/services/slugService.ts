import { nanoid } from 'nanoid'

const SLUG_LENGTH = 12;

export function createSlug(): string {
    return nanoid(SLUG_LENGTH);
}

export function isValidSlug(slug: string): boolean {
    return slug !== undefined && slug !== null && slug.length == SLUG_LENGTH;
}
