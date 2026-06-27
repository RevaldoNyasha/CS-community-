import { afterEach, describe, expect, it, vi } from 'vitest';
import { rss } from '../src/collectors/rss.js';
import { openrouter } from '../src/collectors/openrouter.js';

function mockFetch(body, { json = false } = {}) {
    vi.stubGlobal('fetch', vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => body,
        text: async () => (json ? JSON.stringify(body) : body),
    })));
}

afterEach(() => vi.unstubAllGlobals());

describe('rss collector', () => {
    it('parses an RSS 2.0 feed', async () => {
        const xml = `<?xml version="1.0"?><rss version="2.0"><channel>
            <item>
                <title>Introducing a new model</title>
                <link>https://openai.com/news/new-model</link>
                <description>&lt;p&gt;A brand new model.&lt;/p&gt;</description>
                <pubDate>Fri, 20 Jun 2026 10:00:00 GMT</pubDate>
                <dc:creator>OpenAI</dc:creator>
            </item>
        </channel></rss>`;
        mockFetch(xml);
        const items = await rss.collect({ feeds: [{ name: 'OpenAI', url: 'x', category: 'Artificial Intelligence' }] });
        expect(items[0]).toMatchObject({
            title: 'Introducing a new model',
            url: 'https://openai.com/news/new-model',
            source: 'OpenAI',
            category: 'Artificial Intelligence',
        });
        expect(items[0].description).toContain('brand new model');
        expect(items[0].publishedAt).toMatch(/2026-06-20/);
    });

    it('parses an Atom feed and picks the html link', async () => {
        const xml = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
            <entry>
                <title>New SDK released</title>
                <link rel="self" href="https://x/self"/>
                <link rel="alternate" type="text/html" href="https://huggingface.co/blog/sdk"/>
                <summary>An SDK.</summary>
                <published>2026-05-01T00:00:00Z</published>
                <author><name>HF</name></author>
            </entry>
        </feed>`;
        mockFetch(xml);
        const items = await rss.collect({ feeds: [{ name: 'Hugging Face', url: 'x', category: 'Machine Learning' }] });
        expect(items[0].url).toBe('https://huggingface.co/blog/sdk');
        expect(items[0].author).toBe('HF');
    });
});

describe('openrouter collector', () => {
    it('surfaces models created within the window, newest first', async () => {
        const now = Math.floor(Date.now() / 1000);
        mockFetch({
            data: [
                { id: 'acme/new-model', name: 'New Model', description: 'fresh', created: now - 60 * 60 },
                { id: 'old/ancient', name: 'Ancient', description: 'old', created: now - 400 * 24 * 60 * 60 },
            ],
        }, { json: true });

        const items = await openrouter.collect({ openrouterDays: 45 });
        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({
            title: 'New model on OpenRouter: New Model',
            url: 'https://openrouter.ai/acme/new-model',
            source: 'OpenRouter',
            author: 'acme',
        });
    });
});
