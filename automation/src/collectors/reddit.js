import { XMLParser } from 'fast-xml-parser';
import { fetchWithRetry } from '../utils/http.js';
import { stripHtml } from '../utils/text.js';

const USER_AGENT = 'cs-community-automation/1.0 (content aggregator)';
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

/**
 * Top daily posts from a curated set of subreddits.
 *
 * Reddit's JSON API (`.json`) returns 403 to non-browser clients, so we use the
 * public Atom RSS feed (`/top/.rss`) instead. Subreddits come from
 * `config.redditSubreddits`. Reddit can still rate-limit datacenter IPs, so a
 * subreddit returning nothing is treated as a soft failure (the run continues).
 *
 * @type {import('./index.js').Collector}
 */
export const reddit = {
    name: 'Reddit',
    category: 'Programming',

    /** @param {import('../config.js').Config} [config] */
    async collect(config = {}) {
        const subs = config.redditSubreddits ?? ['programming'];

        const perSub = await Promise.allSettled(subs.map((sub) => fetchSubreddit(sub)));

        /** @type {import('./index.js').RawItem[]} */
        const items = [];
        for (const result of perSub) {
            if (result.status === 'fulfilled') items.push(...result.value);
        }
        return items;
    },
};

/**
 * @param {string} sub
 * @returns {Promise<import('./index.js').RawItem[]>}
 */
async function fetchSubreddit(sub) {
    const res = await fetchWithRetry(
        `https://www.reddit.com/r/${encodeURIComponent(sub)}/top/.rss?t=day&limit=8`,
        { headers: { 'User-Agent': USER_AGENT, Accept: 'application/atom+xml' } },
    );
    if (!res.ok) throw new Error(`Reddit r/${sub} returned ${res.status}`);

    const xml = await res.text();
    const entries = toArray(parser.parse(xml)?.feed?.entry);

    return entries
        .filter((e) => e && e.title && pickLink(e))
        .map((e) => ({
            title: stripHtml(typeof e.title === 'object' ? e.title['#text'] : e.title),
            description: stripHtml(contentText(e.content)).slice(0, 400),
            url: pickLink(e),
            source: `Reddit r/${sub}`,
            image: e['media:thumbnail']?.['@_url'] ?? null,
            author: authorName(e.author),
            publishedAt: e.published ?? e.updated ?? null,
        }));
}

/** @param {*} value */
function toArray(value) {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
}

/** @param {*} entry */
function pickLink(entry) {
    const link = toArray(entry.link)[0];
    if (!link) return '';
    return typeof link === 'string' ? link : (link['@_href'] ?? '');
}

/** @param {*} content */
function contentText(content) {
    if (!content) return '';
    if (typeof content === 'string') return content;
    return content['#text'] ?? '';
}

/** @param {*} author */
function authorName(author) {
    const name = toArray(author)[0]?.name;
    return typeof name === 'string' ? name.replace(/^\/u\//, '') : null;
}
