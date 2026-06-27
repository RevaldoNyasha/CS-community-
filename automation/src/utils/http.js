/**
 * Fetch with exponential-backoff retry on transient failures
 * (network errors, HTTP 429, and 5xx). Uses the global `fetch` (Node 20+).
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @param {{ retries?: number, baseDelayMs?: number, timeoutMs?: number }} [opts]
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options = {}, opts = {}) {
    const { retries = 3, baseDelayMs = 500, timeoutMs = 20000 } = opts;
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            let response;
            try {
                response = await fetch(url, { ...options, signal: controller.signal });
            } finally {
                clearTimeout(timer);
            }

            if (response.status === 429 || response.status >= 500) {
                throw new Error(`Retryable HTTP ${response.status}`);
            }

            return response;
        } catch (error) {
            lastError = error;
            if (attempt === retries) break;
            const delay = baseDelayMs * 2 ** attempt + Math.floor(Math.random() * 100);
            await sleep(delay);
        }
    }

    throw lastError;
}

/** @param {number} ms */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
