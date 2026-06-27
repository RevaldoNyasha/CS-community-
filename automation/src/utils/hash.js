import { createHash } from 'node:crypto';

/**
 * Stable content hash for de-duplication. Mirrors the Laravel side
 * (`sha256(title|source_url)`) so both layers agree on identity.
 *
 * @param {string} title
 * @param {string} url
 * @returns {string}
 */
export function contentHash(title, url) {
    return createHash('sha256').update(`${title}|${url}`).digest('hex');
}
