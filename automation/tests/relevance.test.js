import { describe, expect, it } from 'vitest';
import { rankByRelevance, relevanceScore } from '../src/services/relevance.js';

const keywords = ['ai', 'laravel', 'python', 'react'];

describe('relevanceScore', () => {
    it('counts focus keyword hits in title + description', () => {
        const score = relevanceScore({ title: 'Building AI agents with Python', description: 'using Laravel too' }, keywords);
        expect(score).toBe(3); // ai, python, laravel
    });

    it('is zero for off-topic items', () => {
        expect(relevanceScore({ title: 'Gardening tips', description: 'soil and water' }, keywords)).toBe(0);
    });
});

describe('rankByRelevance', () => {
    const items = [
        { title: 'Off topic cooking', description: '' },
        { title: 'AI and Laravel and Python', description: 'react' },
        { title: 'A bit of AI', description: '' },
    ];

    it('sorts most relevant first', () => {
        const { ranked } = rankByRelevance(items, { keywords, minScore: 0, limit: 10 });
        expect(ranked[0].title).toBe('AI and Laravel and Python');
        expect(ranked[0]._score).toBe(4);
    });

    it('drops off-topic items when enough focused ones remain', () => {
        const { ranked, dropped } = rankByRelevance(items, { keywords, minScore: 1, limit: 2 });
        expect(ranked.every((i) => i._score >= 1)).toBe(true);
        expect(dropped).toBe(1);
    });

    it('keeps everything (safety net) when filtering would leave too few', () => {
        const { ranked, dropped } = rankByRelevance(items, { keywords, minScore: 1, limit: 5 });
        expect(ranked).toHaveLength(3);
        expect(dropped).toBe(0);
    });
});
