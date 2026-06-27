/**
 * Estimate reading time in whole minutes from a piece of text,
 * assuming ~200 words/minute. Returns null for empty input.
 *
 * @param {string|null|undefined} text
 * @returns {number|null}
 */
export function estimateReadingTime(text) {
    if (!text) return null;
    const words = String(text).trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) return null;
    return Math.max(1, Math.round(words / 200));
}
