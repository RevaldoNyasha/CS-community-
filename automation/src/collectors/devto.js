import { fetchWithRetry } from '../utils/http.js';
import { stripHtml } from '../utils/text.js';

/**
 * Top Dev.to articles for the focus tags (public API, no auth).
 * Tags are configured via `config.devtoTags`.
 *
 * @type {import('./index.js').Collector}
 */
export const devto = {
    name: 'Dev.to',
    category: 'Programming',

    /** @param {import('../config.js').Config} [config] */
    async collect(config = {}) {
        const tags = config.devtoTags ?? ['ai', 'webdev'];

        const perTag = await Promise.allSettled(tags.map((tag) => fetchTag(tag)));

        /** @type {import('./index.js').RawItem[]} */
        const items = [];
        for (const result of perTag) {
            if (result.status === 'fulfilled') items.push(...result.value);
        }
        return items;
    },
};

/**
 * @param {string} tag
 * @returns {Promise<import('./index.js').RawItem[]>}
 */
async function fetchTag(tag) {
    const res = await fetchWithRetry(`https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&top=7&per_page=6`);
    if (!res.ok) throw new Error(`Dev.to tag "${tag}" returned ${res.status}`);

    const articles = await res.json();
    if (!Array.isArray(articles)) return [];

    return articles
        .filter((a) => a && a.title && a.url)
        .map((a) => ({
            title: String(a.title).trim(),
            description: stripHtml(a.description),
            url: a.url,
            source: 'Dev.to',
            image: a.cover_image || a.social_image || null,
            author: a.user?.name ?? null,
            publishedAt: a.published_at ?? a.published_timestamp ?? null,
        }));
}
