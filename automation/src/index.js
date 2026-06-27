import { loadConfig } from './config.js';
import { runPipeline } from './pipeline.js';
import { createLogger } from './services/logger.js';

/**
 * Entrypoint. Exits non-zero only on catastrophic failure (bad config or an
 * unhandled crash) — a single failed source or article is logged, not fatal,
 * so CI surfaces real breakage rather than flaky upstream APIs.
 */
async function main() {
    const logger = createLogger();

    let config;
    try {
        config = loadConfig();
    } catch (error) {
        console.error(JSON.stringify({ level: 'fatal', message: 'config.invalid', error: String(error?.message ?? error) }));
        process.exit(1);
        return;
    }

    logger.info('run.start', { dryRun: config.dryRun, maxItems: config.maxItems, model: config.geminiModel });

    try {
        await runPipeline(config, logger);
    } catch (error) {
        logger.error('run.crashed', { error: String(error?.message ?? error) });
        await logger.flush();
        process.exit(1);
        return;
    }

    await logger.flush();
}

main();
