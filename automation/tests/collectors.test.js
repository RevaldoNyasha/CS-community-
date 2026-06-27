import { afterEach, describe, expect, it, vi } from 'vitest';
import { hackernews } from '../src/collectors/hackernews.js';
import { devto } from '../src/collectors/devto.js';
import { githubTrending } from '../src/collectors/githubTrending.js';
import { arxiv } from '../src/collectors/arxiv.js';
import { reddit } from '../src/collectors/reddit.js';

function mockFetch(body, { json = true, ok = true, status = 200 } = {}) {
    vi.stubGlobal('fetch', vi.fn(async () => ({
        ok,
        status,
        json: async () => body,
        text: async () => (json ? JSON.stringify(body) : body),
    })));
}

afterEach(() => vi.unstubAllGlobals());

describe('hackernews collector', () => {
    it('normalizes hits and falls back to the HN item url', async () => {
        mockFetch({ hits: [{ title: 'Ask HN', objectID: '42', author: 'pg', created_at: '2026-01-01' }] });
        const items = await hackernews.collect();
        expect(items[0]).toMatchObject({
            title: 'Ask HN',
            url: 'https://news.ycombinator.com/item?id=42',
            source: 'Hacker News',
            author: 'pg',
        });
    });
});

describe('devto collector', () => {
    it('maps title, url, cover image and author across tags', async () => {
        mockFetch([{ title: 'Post', url: 'https://dev.to/p', cover_image: 'https://img', user: { name: 'Ann' }, published_at: '2026-02-02' }]);
        const items = await devto.collect({ devtoTags: ['python'] });
        expect(items[0]).toMatchObject({ title: 'Post', url: 'https://dev.to/p', image: 'https://img', author: 'Ann' });
    });
});

describe('reddit collector', () => {
    it('parses the Atom RSS feed and maps entries', async () => {
        const xml = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
            <entry>
                <title>New LLM dropped</title>
                <link href="https://www.reddit.com/r/LocalLLaMA/comments/abc/new_llm/"/>
                <content type="html">&lt;p&gt;submitted by /u/u1&lt;/p&gt;</content>
                <author><name>/u/u1</name></author>
                <published>2026-06-20T00:00:00Z</published>
            </entry>
        </feed>`;
        mockFetch(xml, { json: false });
        const items = await reddit.collect({ redditSubreddits: ['LocalLLaMA'] });
        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({
            title: 'New LLM dropped',
            url: 'https://www.reddit.com/r/LocalLLaMA/comments/abc/new_llm/',
            source: 'Reddit r/LocalLLaMA',
            author: 'u1',
        });
    });
});

describe('githubTrending collector', () => {
    it('maps repositories from the search API', async () => {
        mockFetch({ items: [{ full_name: 'a/b', description: 'cool', html_url: 'https://github.com/a/b', stargazers_count: 10, language: 'Go', owner: { login: 'a', avatar_url: 'https://av' }, created_at: '2026-03-03' }] });
        const items = await githubTrending.collect();
        expect(items[0]).toMatchObject({ url: 'https://github.com/a/b', source: 'GitHub Trending', author: 'a' });
        expect(items[0].title).toContain('a/b');
    });
});

describe('arxiv collector', () => {
    it('parses Atom XML entries', async () => {
        const xml = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
            <entry>
                <title>Deep Nets</title>
                <summary>We study deep nets.</summary>
                <id>http://arxiv.org/abs/1234</id>
                <published>2026-04-04T00:00:00Z</published>
                <author><name>R. Searcher</name></author>
                <link href="http://arxiv.org/abs/1234" type="text/html"/>
            </entry>
        </feed>`;
        mockFetch(xml, { json: false });
        const items = await arxiv.collect();
        expect(items[0]).toMatchObject({
            title: 'Deep Nets',
            url: 'http://arxiv.org/abs/1234',
            source: 'arXiv',
            author: 'R. Searcher',
        });
    });
});
