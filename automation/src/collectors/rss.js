import { XMLParser } from 'fast-xml-parser';
import { fetchWithRetry } from '../utils/http.js';
import { stripHtml } from '../utils/text.js';

const USER_AGENT = 'Mozilla/5.0 (compatible; cs-community-bot/1.0)';
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
const PER_FEED = 6;

/**
 * Generic RSS 2.0 / Atom collector. Reads a configured list of official
 * developer blogs (GitHub, OpenAI, Meta, Google, Hugging Face, n8n, …) so new
 * sources are added by editing `config.feeds` — no new code.
 *
 * @type {import('./index.js').Collector}
 */
export const rss = {
    name: 'Blogs',
    category: 'Programming',

    /** @param {import('../config.js').Config} [config] */
    async collect(config = {}) {
        const feeds = config.feeds ?? [];
        const results = await Promise.allSettled(feeds.map((feed) => fetchFeed(feed)));

        /** @type {import('./index.js').RawItem[]} */
        const items = [];
        for (const result of results) {
            if (result.status === 'fulfilled') items.push(...result.value);
        }
        return items;
    },
};

/**
 * @param {{ name: string, url: string, category: string }} feed
 * @returns {Promise<import('./index.js').RawItem[]>}
 */
async function fetchFeed(feed) {
    const res = await fetchWithRetry(feed.url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/atom+xml, application/xml' },
    });
    if (!res.ok) throw new Error(`${feed.name} feed returned ${res.status}`);

    const parsed = parser.parse(await res.text());
    const entries = extractEntries(parsed).slice(0, PER_FEED);

    return entries
        .map((entry) => normalizeEntry(entry, feed))
        .filter((item) => item.title && item.url);
}

/** Pull the item/entry array from RSS 2.0, RSS 1.0 (RDF), or Atom. @param {*} parsed */
function extractEntries(parsed) {
    if (parsed?.rss?.channel) return toArray(parsed.rss.channel.item);
    if (parsed?.['rdf:RDF']) return toArray(parsed['rdf:RDF'].item);
    if (parsed?.feed) return toArray(parsed.feed.entry);
    return [];
}

/**
 * @param {*} entry
 * @param {{ name: string, category: string }} feed
 * @returns {import('./index.js').RawItem}
 */
function normalizeEntry(entry, feed) {
    const description = stripHtml(text(entry.description) || text(entry.summary) || text(entry['content:encoded']) || text(entry.content)).slice(0, 500);

    return {
        title: stripHtml(text(entry.title)),
        description,
        url: pickUrl(entry),
        source: feed.name,
        image: pickImage(entry),
        author: text(entry['dc:creator']) || authorName(entry.author) || null,
        publishedAt: toIso(entry.pubDate ?? entry.published ?? entry.updated ?? entry['dc:date']),
        category: feed.category,
    };
}

/** @param {*} value */
function toArray(value) {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
}

/** Read a node that may be a string or an object like { '#text': '...' }. @param {*} node */
function text(node) {
    if (node === undefined || node === null) return '';
    if (typeof node === 'string') return node;
    if (typeof node === 'object' && '#text' in node) return String(node['#text']);
    return '';
}

/** @param {*} entry */
function pickUrl(entry) {
    // RSS: <link>https://...</link>
    if (typeof entry.link === 'string') return entry.link;
    // Atom: <link href=".." rel="alternate" type="text/html"/> (possibly several)
    const links = toArray(entry.link);
    const html = links.find((l) => l && l['@_type'] === 'text/html' && l['@_rel'] !== 'self');
    const alternate = links.find((l) => l && (l['@_rel'] === 'alternate' || !l['@_rel']));
    const chosen = html ?? alternate ?? links[0];
    if (chosen && chosen['@_href']) return chosen['@_href'];
    return text(entry.id) || text(entry.guid);
}

/** @param {*} entry */
function pickImage(entry) {
    const media = entry['media:content'] ?? entry['media:thumbnail'];
    if (media && media['@_url']) return media['@_url'];
    if (entry.enclosure && entry.enclosure['@_url']) return entry.enclosure['@_url'];
    return null;
}

/** @param {*} author */
function authorName(author) {
    const first = toArray(author)[0];
    if (!first) return null;
    if (typeof first === 'string') return first;
    return first.name ?? null;
}

/** @param {*} value */
function toIso(value) {
    if (!value) return null;
    const date = new Date(text(value) || value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
