import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('loadConfig', () => {
    it('falls back to defaults when CI passes empty-string vars', () => {
        // GitHub Actions passes an unset `${{ vars.X }}` as "" (not undefined).
        const cfg = loadConfig(
            { GEMINI_API_KEY: 'k', GEMINI_MODEL: '', MAX_ITEMS: '', GEMINI_DELAY_MS: '', MIN_RELEVANCE: '', DRY_RUN: '1' },
            [],
        );
        expect(cfg.geminiModel).toBe('gemini-2.5-flash');
        expect(cfg.maxItems).toBe(15);
        expect(cfg.geminiDelayMs).toBe(4000);
        expect(cfg.minRelevance).toBe(1);
    });

    it('respects provided overrides', () => {
        const cfg = loadConfig(
            { GEMINI_API_KEY: 'k', GEMINI_MODEL: 'gemini-2.5-flash', MAX_ITEMS: '3', DRY_RUN: '1' },
            [],
        );
        expect(cfg.geminiModel).toBe('gemini-2.5-flash');
        expect(cfg.maxItems).toBe(3);
    });

    it('throws when required secrets are missing (non-dry-run)', () => {
        expect(() => loadConfig({ GEMINI_API_KEY: '' }, [])).toThrow(/GEMINI_API_KEY/);
    });
});
