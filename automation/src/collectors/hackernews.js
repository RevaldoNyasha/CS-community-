import { fetchWithRetry } from '../utils/http.js';
import { stripHtml } from '../utils/text.js';

/**
 * Hacker News front page via the Algolia API (JSON, no auth).
 * @type {import('./index.js').Collector}
 */
export const hackernews = {
    name: 'Hacker News',
    category: 'Programming',

    async collect() {
        const res = await fetchWithRetry('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=20');
        if (!res.ok) throw new Error(`Hacker News API returned ${res.status}`);

        const data = await res.json();
        const hits = Array.isArray(data.hits) ? data.hits : [];

        return hits
            .filter((h) => h && h.title)
            .map((h) => ({
                title: String(h.title).trim(),
                description: stripHtml(h.story_text),
                url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
                source: this.name,
                image: null,
                author: h.author ?? null,
                publishedAt: h.created_at ?? null,
            }));
    },
};
