import { describe, expect, it } from 'vitest';
import { buildPayload } from '../src/pipeline.js';
import { dedupe } from '../src/services/duplicateChecker.js';

describe('dedupe', () => {
    it('removes repeated urls and drops items missing title/url', () => {
        const { unique, duplicates } = dedupe([
            { title: 'A', url: 'https://x.com/a' },
            { title: 'A', url: 'https://x.com/a' }, // dup
            { title: 'B', url: 'https://x.com/b' },
            { title: '', url: 'https://x.com/c' }, // invalid
            { title: 'D', url: '' }, // invalid
        ]);
        expect(unique.map((i) => i.url)).toEqual(['https://x.com/a', 'https://x.com/b']);
        expect(duplicates).toBe(3);
    });
});

describe('buildPayload', () => {
    it('maps a raw item + enrichment to the Laravel contract', () => {
        const item = {
            title: 'Cool Repo',
            description: 'word '.repeat(400),
            url: 'https://github.com/x/y',
            source: 'GitHub Trending',
            image: 'https://img',
            author: 'octocat',
            publishedAt: '2026-06-20T00:00:00Z',
            _category: 'Open Source',
        };
        const enrichment = { summary: 'Nice.', category: 'Open Source', difficulty: 'Beginner', tags: ['go'] };

        const payload = buildPayload(item, enrichment);
        expect(payload.source_url).toBe('https://github.com/x/y');
        expect(payload.category).toBe('Open Source');
        expect(payload.author).toBe('octocat');
        expect(payload.reading_time_minutes).toBe(2); // ~400 words / 200
        expect(payload.source_published_at).toBe('2026-06-20T00:00:00Z');
    });

    it('falls back to the collector category when enrichment lacks one', () => {
        const payload = buildPayload(
            { title: 't', description: '', url: 'u', source: 's', image: null, author: null, publishedAt: null, _category: 'Research Papers' },
            { summary: 's', category: '', difficulty: 'Advanced', tags: [] },
        );
        expect(payload.category).toBe('Research Papers');
        expect(payload.reading_time_minutes).toBeNull();
    });
});
