import { CATEGORIES, DIFFICULTIES } from '../config.js';

/**
 * System instruction for Gemini. It must NOT browse — only restructure the
 * provided text. Output is additionally constrained by a responseSchema.
 * @returns {string}
 */
export function systemPrompt() {
    return [
        'You are a content editor for a Computer Science student community.',
        'You will be given a single article TITLE, DESCRIPTION and SOURCE URL.',
        'Rules:',
        '- Do NOT use outside knowledge or browse the internet. Use only the text provided.',
        '- If the description is thin, summarise from the title alone. Never fabricate details.',
        '- Write for university CS students: clear, neutral, no hype, no marketing language.',
        'Return ONLY JSON with: summary (1-3 sentences, <=400 chars, plain text),',
        `category (exactly one of: ${CATEGORIES.join(', ')}),`,
        `difficulty (one of: ${DIFFICULTIES.join(', ')}),`,
        'tags (3-5 short lowercase tags, no #).',
    ].join('\n');
}

/**
 * The structured-output schema sent as generationConfig.responseSchema.
 * Keeping `category`/`difficulty` as enums forces valid values.
 */
export function responseSchema() {
    return {
        type: 'object',
        properties: {
            summary: { type: 'string' },
            category: { type: 'string', enum: CATEGORIES },
            difficulty: { type: 'string', enum: DIFFICULTIES },
            tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['summary', 'category', 'difficulty', 'tags'],
    };
}

/**
 * Render the per-item user message.
 * @param {import('../collectors/index.js').RawItem} item
 * @returns {string}
 */
export function userPrompt(item) {
    return [
        `TITLE: ${item.title}`,
        `DESCRIPTION: ${item.description || '(none)'}`,
        `SOURCE URL: ${item.url}`,
    ].join('\n');
}
