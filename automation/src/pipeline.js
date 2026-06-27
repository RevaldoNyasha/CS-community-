import { enrich } from './ai/gemini.js';
import { collectors as defaultCollectors } from './collectors/index.js';
import { publish } from './services/laravel.js';
import { dedupe } from './services/duplicateChecker.js';
import { rankByRelevance } from './services/relevance.js';
import { sleep } from './utils/http.js';
import { estimateReadingTime } from './utils/readingTime.js';
import { truncate } from './utils/text.js';

/**
 * Run the full pipeline: collect → dedupe → cap → enrich → publish.
 * One failing source or article never aborts the run.
 *
 * @param {import('./config.js').Config} config
 * @param {ReturnType<import('./services/logger.js').createLogger>} logger
 * @param {{ collectors?: import('./collectors/index.js').Collector[] }} [deps]
 */
export async function runPipeline(config, logger, deps = {}) {
    const collectors = deps.collectors ?? defaultCollectors;

    // 1. Collect from every source in parallel; isolate failures.
    const results = await Promise.allSettled(
        collectors.map(async (c) => ({ collector: c, items: await c.collect(config) })),
    );

    /** @type {import('./collectors/index.js').RawItem[]} */
    const all = [];
    for (let i = 0; i < results.length; i++) {
        const r = results[i];
        const name = collectors[i].name;
        if (r.status === 'fulfilled') {
            logger.recordSource(name, r.value.items.length);
            for (const item of r.value.items) all.push({ ...item, _category: collectors[i].category });
        } else {
            logger.error('collector.failed', { source: name, error: String(r.reason?.message ?? r.reason) });
        }
    }

    // 2. De-duplicate within this run.
    const { unique, duplicates } = dedupe(all);
    logger.stats.duplicates = duplicates;

    // 3. Rank by editorial focus (AI engineering, web frameworks, Python, Laravel, ...).
    const { ranked, dropped } = rankByRelevance(unique, {
        keywords: config.focusKeywords,
        minScore: config.minRelevance,
        limit: config.maxItems,
    });
    logger.stats.offTopicDropped = dropped;

    // 4. Cap for Gemini free-tier safety (highest-relevance items first).
    const batch = ranked.slice(0, config.maxItems);
    logger.info('pipeline.batch', {
        collected: all.length,
        unique: unique.length,
        offTopicDropped: dropped,
        batch: batch.length,
    });

    // 5. Enrich + publish each item, spacing Gemini calls to respect free-tier RPM.
    for (let i = 0; i < batch.length; i++) {
        const item = batch[i];
        if (i > 0 && config.geminiDelayMs > 0) await sleep(config.geminiDelayMs);

        let enrichment;
        try {
            enrichment = await enrich(item, config);
            logger.stats.enriched++;
        } catch (error) {
            logger.stats.geminiFailures++;
            logger.warn('gemini.failed', { url: item.url, error: String(error?.message ?? error) });
            continue;
        }

        const payload = buildPayload(item, enrichment);

        if (config.dryRun) {
            logger.info('publish.dryRun', { title: payload.title, category: payload.category, source: payload.source });
            continue;
        }

        try {
            const result = await publish(payload, config);
            if (result.status === 'created') logger.stats.published++;
            else if (result.status === 'skipped') logger.stats.skipped++;
            else {
                logger.stats.failed++;
                logger.error('publish.failed', { url: payload.source_url, reason: result.reason });
            }
        } catch (error) {
            logger.stats.failed++;
            logger.error('publish.error', { url: payload.source_url, error: String(error?.message ?? error) });
        }
    }
}

/**
 * Assemble the Laravel payload from a raw item + Gemini enrichment.
 *
 * @param {import('./collectors/index.js').RawItem & { _category?: string }} item
 * @param {import('./ai/gemini.js').Enrichment} enrichment
 */
export function buildPayload(item, enrichment) {
    return {
        title: truncate(item.title, 255),
        summary: truncate(enrichment.summary, 1000),
        category: enrichment.category || item._category || 'Other',
        difficulty: enrichment.difficulty,
        tags: enrichment.tags,
        source: item.source,
        source_url: item.url,
        image_url: item.image ?? null,
        author: item.author ? truncate(item.author, 120) : null,
        reading_time_minutes: estimateReadingTime(item.description),
        source_published_at: item.publishedAt ?? null,
    };
}
