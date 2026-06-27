import { CATEGORIES, DIFFICULTIES } from '../config.js';
import { fetchWithRetry } from '../utils/http.js';
import { responseSchema, systemPrompt, userPrompt } from './prompts.js';

/**
 * @typedef {Object} Enrichment
 * @property {string}   summary
 * @property {string}   category
 * @property {string}   difficulty
 * @property {string[]} tags
 */

/**
 * Enrich one item with Gemini. Returns structured JSON or throws on failure
 * (the caller decides whether to skip the item). Retries are handled by
 * fetchWithRetry; this adds JSON-shape validation on top.
 *
 * @param {import('../collectors/index.js').RawItem} item
 * @param {import('../config.js').Config} config
 * @returns {Promise<Enrichment>}
 */
export async function enrich(item, config) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;

    const body = {
        systemInstruction: { parts: [{ text: systemPrompt() }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt(item) }] }],
        generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json',
            responseSchema: responseSchema(),
        },
    };

    const res = await fetchWithRetry(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        },
        // Patient backoff (3s,6s,12s,24s) so free-tier 429/503 (per-minute RPM
        // limits, transient overloads) get a real chance to clear.
        { retries: 4, baseDelayMs: 3000, timeoutMs: 30000 },
    );

    if (!res.ok) {
        const detail = await safeText(res);
        throw new Error(`Gemini returned ${res.status}: ${detail.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini response had no text part');

    return normalize(JSON.parse(text));
}

/**
 * Validate/repair the parsed Gemini object so it always satisfies the
 * Laravel contract (valid category/difficulty, 3-5 string tags).
 *
 * @param {*} raw
 * @returns {Enrichment}
 */
export function normalize(raw) {
    if (!raw || typeof raw.summary !== 'string' || !raw.summary.trim()) {
        throw new Error('Gemini output missing summary');
    }

    const category = CATEGORIES.includes(raw.category) ? raw.category : 'Other';
    const difficulty = DIFFICULTIES.includes(raw.difficulty) ? raw.difficulty : 'Intermediate';
    const tags = Array.isArray(raw.tags)
        ? raw.tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean).slice(0, 5)
        : [];

    return { summary: raw.summary.trim(), category, difficulty, tags };
}

/** @param {Response} res */
async function safeText(res) {
    try {
        return await res.text();
    } catch {
        return '';
    }
}
