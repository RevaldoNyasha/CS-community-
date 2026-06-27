import { fetchWithRetry } from '../utils/http.js';

/**
 * @typedef {Object} PublishResult
 * @property {'created'|'skipped'|'failed'} status
 * @property {number} [httpStatus]
 * @property {string} [reason]
 */

/**
 * Publish one payload to the Laravel ingestion endpoint. Treats both 201
 * (created) and 200 (skipped duplicate) as success; everything else is failed.
 *
 * @param {object} payload
 * @param {import('../config.js').Config} config
 * @returns {Promise<PublishResult>}
 */
export async function publish(payload, config) {
    const res = await fetchWithRetry(
        `${config.laravelApiUrl}/api/automation/posts`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${config.laravelApiToken}`,
            },
            body: JSON.stringify(payload),
        },
        { retries: 2, baseDelayMs: 1000, timeoutMs: 20000 },
    );

    let json = {};
    try {
        json = await res.json();
    } catch {
        // non-JSON body — fall through to status handling
    }

    if (res.status === 201) return { status: 'created', httpStatus: 201 };
    if (res.status === 200) return { status: 'skipped', httpStatus: 200, reason: json.reason ?? 'duplicate' };

    return { status: 'failed', httpStatus: res.status, reason: json.message ?? `HTTP ${res.status}` };
}
