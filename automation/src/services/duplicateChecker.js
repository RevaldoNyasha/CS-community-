import { contentHash } from '../utils/hash.js';

/**
 * Remove intra-run duplicates by URL and by content hash (title|url).
 * Cross-run de-duplication is enforced by Laravel (unique source_url +
 * content_hash), which returns a "skipped" response for repeats.
 *
 * @param {import('../collectors/index.js').RawItem[]} items
 * @returns {{ unique: import('../collectors/index.js').RawItem[], duplicates: number }}
 */
export function dedupe(items) {
    const seen = new Set();
    const unique = [];
    let duplicates = 0;

    for (const item of items) {
        if (!item.url || !item.title) {
            duplicates++;
            continue;
        }
        const key = `${item.url}::${contentHash(item.title, item.url)}`;
        if (seen.has(key)) {
            duplicates++;
            continue;
        }
        seen.add(key);
        unique.push(item);
    }

    return { unique, duplicates };
}
