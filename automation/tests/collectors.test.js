import { afterEach, describe, expect, it, vi } from 'vitest';
import { githubTrending } from '../src/collectors/githubTrending.js';
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

describe('githubTrending collector', () => {
    it('maps repositories from the search API', async () => {
        mockFetch({ items: [{ full_name: 'a/b', description: 'cool', html_url: 'https://github.com/a/b', stargazers_count: 10, language: 'Go', owner: { login: 'a', avatar_url: 'https://av' }, created_at: '2026-03-03' }] });
        const items = await githubTrending.collect();
        expect(items[0]).toMatchObject({ url: 'https://github.com/a/b', source: 'GitHub Trending', author: 'a' });
        expect(items[0].title).toContain('a/b');
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
