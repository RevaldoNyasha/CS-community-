/**
 * Editorial focus ranking. Scores each item by how many focus keywords appear
 * in its title/description, sorts highest-first, and (optionally) drops items
 * below a minimum score — with a safety net so a quiet day never publishes zero.
 */

/**
 * @param {import('../collectors/index.js').RawItem} item
 * @param {string[]} keywords  lowercase focus terms
 * @returns {number}
 */
export function relevanceScore(item, keywords) {
    const haystack = `${item.title} ${item.description ?? ''}`.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
        if (kw && haystack.includes(kw)) score++;
    }
    return score;
}

/**
 * Rank items by focus relevance and apply a soft minimum-score filter.
 *
 * @param {import('../collectors/index.js').RawItem[]} items
 * @param {{ keywords: string[], minScore: number, limit: number }} opts
 * @returns {{ ranked: (import('../collectors/index.js').RawItem & { _score: number })[], dropped: number }}
 */
export function rankByRelevance(items, { keywords, minScore, limit }) {
    const scored = items
        .map((item) => ({ ...item, _score: relevanceScore(item, keywords) }))
        .sort((a, b) => b._score - a._score);

    if (minScore <= 0) return { ranked: scored, dropped: 0 };

    const focused = scored.filter((i) => i._score >= minScore);
    // Safety net: if filtering leaves us short, top up from the ranked list so
    // we still fill the batch (focused items remain first thanks to the sort).
    if (focused.length >= limit) {
        return { ranked: focused, dropped: scored.length - focused.length };
    }
    return { ranked: scored, dropped: 0 };
}
