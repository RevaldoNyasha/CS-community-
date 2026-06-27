import { describe, expect, it } from 'vitest';
import { normalize } from '../src/ai/gemini.js';

describe('gemini normalize', () => {
    it('passes through valid output', () => {
        const out = normalize({
            summary: 'A clear summary.',
            category: 'Web Development',
            difficulty: 'Beginner',
            tags: ['React', 'Vite'],
        });
        expect(out).toEqual({
            summary: 'A clear summary.',
            category: 'Web Development',
            difficulty: 'Beginner',
            tags: ['react', 'vite'],
        });
    });

    it('falls back to Other/Intermediate for invalid enums', () => {
        const out = normalize({
            summary: 'x',
            category: 'Nonsense',
            difficulty: 'Wizard',
            tags: ['a', 'b', 'c', 'd', 'e', 'f'],
        });
        expect(out.category).toBe('Other');
        expect(out.difficulty).toBe('Intermediate');
        expect(out.tags).toHaveLength(5); // capped at 5
    });

    it('throws when summary is missing', () => {
        expect(() => normalize({ category: 'Programming', tags: [] })).toThrow();
    });
});
