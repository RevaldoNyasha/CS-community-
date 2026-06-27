import { fetchWithRetry } from '../utils/http.js';
import { stripHtml } from '../utils/text.js';

const USER_AGENT = 'Mozilla/5.0 (compatible; cs-community-bot/1.0)';

/**
 * Newly-added models on OpenRouter. OpenRouter has no RSS, but its models API
 * exposes a `created` timestamp, so we surface models added within a recent
 * window. Laravel de-dupes by URL, so each new model posts only once.
 *
 * @type {import('./index.js').Collector}
 */
export const openrouter = {
    name: 'OpenRouter',
    category: 'Artificial Intelligence',

    /** @param {import('../config.js').Config} [config] */
    async collect(config = {}) {
        const windowDays = config.openrouterDays ?? 45;
        const cutoff = Date.now() / 1000 - windowDays * 24 * 60 * 60;

        const res = await fetchWithRetry('https://openrouter.ai/api/v1/models', {
            headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`OpenRouter models API returned ${res.status}`);

        const data = await res.json();
        const models = Array.isArray(data?.data) ? data.data : [];

        return models
            .filter((m) => m && m.id && typeof m.created === 'number' && m.created >= cutoff)
            .sort((a, b) => b.created - a.created)
            .slice(0, 10)
            .map((m) => ({
                title: `New model on OpenRouter: ${m.name || m.id}`,
                description: stripHtml(m.description).slice(0, 500),
                url: `https://openrouter.ai/${m.id}`,
                source: this.name,
                image: null,
                author: String(m.id).split('/')[0] || null,
                publishedAt: new Date(m.created * 1000).toISOString(),
                category: this.category,
            }));
    },
};
