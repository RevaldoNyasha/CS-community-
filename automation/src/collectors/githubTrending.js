import { fetchWithRetry } from '../utils/http.js';

/**
 * "Trending" repositories via the official GitHub Search API — recently created
 * repos sorted by stars. More robust than scraping the trending HTML page.
 * Optional GITHUB_TOKEN (passed via config) raises the rate limit.
 *
 * @type {import('./index.js').Collector}
 */
export const githubTrending = {
    name: 'GitHub Trending',
    category: 'Open Source',

    /** @param {{ githubToken?: string|null }} [ctx] */
    async collect(ctx = {}) {
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const url = `https://api.github.com/search/repositories?q=created:>${since}&sort=stars&order=desc&per_page=20`;

        const headers = {
            Accept: 'application/vnd.github+json',
            'User-Agent': 'cs-community-automation',
        };
        if (ctx.githubToken) headers.Authorization = `Bearer ${ctx.githubToken}`;

        const res = await fetchWithRetry(url, { headers });
        if (!res.ok) throw new Error(`GitHub Search API returned ${res.status}`);

        const data = await res.json();
        const repos = Array.isArray(data.items) ? data.items : [];

        return repos
            .filter((r) => r && r.full_name && r.html_url)
            .map((r) => ({
                title: `${r.full_name}${r.description ? ` — ${r.description}` : ''}`.slice(0, 240),
                description: r.description || `${r.full_name}: a trending open-source repository (${r.stargazers_count} stars, ${r.language ?? 'multi-language'}).`,
                url: r.html_url,
                source: this.name,
                image: r.owner?.avatar_url ?? null,
                author: r.owner?.login ?? null,
                publishedAt: r.created_at ?? null,
            }));
    },
};
