import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LOG_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'logs');

/**
 * Structured run logger. Emits JSON lines to the console (so GitHub Actions
 * captures them) and accumulates a summary written to logs/run-<ts>.json.
 */
export function createLogger() {
    const startedAt = new Date();
    /** @type {object[]} */
    const events = [];
    const stats = {
        sources: {},
        collected: 0,
        duplicates: 0,
        offTopicDropped: 0,
        enriched: 0,
        geminiFailures: 0,
        published: 0,
        skipped: 0,
        failed: 0,
    };

    /**
     * @param {string} level
     * @param {string} message
     * @param {object} [data]
     */
    function log(level, message, data = {}) {
        const entry = { ts: new Date().toISOString(), level, message, ...data };
        events.push(entry);
        console.log(JSON.stringify(entry));
    }

    return {
        stats,
        info: (message, data) => log('info', message, data),
        warn: (message, data) => log('warn', message, data),
        error: (message, data) => log('error', message, data),

        /** @param {string} source @param {number} count */
        recordSource(source, count) {
            stats.sources[source] = count;
            stats.collected += count;
        },

        /**
         * Persist the run summary as an artifact-friendly JSON file.
         * @returns {Promise<string>} the file path written.
         */
        async flush() {
            const finishedAt = new Date();
            const summary = {
                startedAt: startedAt.toISOString(),
                finishedAt: finishedAt.toISOString(),
                durationMs: finishedAt - startedAt,
                stats,
                events,
            };
            await mkdir(LOG_DIR, { recursive: true });
            const file = join(LOG_DIR, `run-${startedAt.toISOString().replace(/[:.]/g, '-')}.json`);
            await writeFile(file, JSON.stringify(summary, null, 2), 'utf8');
            console.log(JSON.stringify({ ts: finishedAt.toISOString(), level: 'info', message: 'run.summary', stats }));
            return file;
        },
    };
}
