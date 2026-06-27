/**
 * Strip HTML tags and collapse whitespace. Laravel sanitizes again on its side;
 * this just keeps the text we send to Gemini clean.
 *
 * @param {string|null|undefined} input
 * @returns {string}
 */
export function stripHtml(input) {
    if (!input) return '';
    return String(input)
        .replace(/<[^>]*>/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Truncate to a maximum length without cutting mid-word where possible.
 *
 * @param {string} input
 * @param {number} max
 * @returns {string}
 */
export function truncate(input, max) {
    const text = String(input ?? '');
    if (text.length <= max) return text;
    const slice = text.slice(0, max);
    const lastSpace = slice.lastIndexOf(' ');
    return (lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice).trim();
}
