import { XMLParser } from 'fast-xml-parser';
import { fetchWithRetry } from '../utils/http.js';
import { stripHtml } from '../utils/text.js';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

/**
 * Recent Computer Science papers from the arXiv Atom API.
 * @type {import('./index.js').Collector}
 */
export const arxiv = {
    name: 'arXiv',
    category: 'Research Papers',

    async collect() {
        const url = 'http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL+OR+cat:cs.SE&sortBy=submittedDate&sortOrder=descending&max_results=20';
        const res = await fetchWithRetry(url);
        if (!res.ok) throw new Error(`arXiv API returned ${res.status}`);

        const xml = await res.text();
        const feed = parser.parse(xml)?.feed;
        const entries = toArray(feed?.entry);

        return entries
            .filter((e) => e && e.title && e.id)
            .map((e) => ({
                title: stripHtml(e.title),
                description: stripHtml(e.summary),
                url: pickLink(e),
                source: this.name,
                image: null,
                author: authorName(e.author),
                publishedAt: e.published ?? null,
            }))
            .filter((item) => item.url);
    },
};

/** @param {*} value */
function toArray(value) {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
}

/** @param {*} entry */
function pickLink(entry) {
    const links = toArray(entry.link);
    const html = links.find((l) => l?.['@_type'] === 'text/html');
    return html?.['@_href'] ?? (typeof entry.id === 'string' ? entry.id : '');
}

/** @param {*} author */
function authorName(author) {
    const first = toArray(author)[0];
    return first?.name ?? null;
}
