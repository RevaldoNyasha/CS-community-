/**
 * Environment-driven configuration. All secrets come from process.env
 * (GitHub Secrets in CI, a local `.env` via `node --env-file` in development).
 *
 * @typedef {Object} Config
 * @property {string}   geminiApiKey
 * @property {string}   geminiModel
 * @property {string}   laravelApiUrl    Base URL, no trailing slash.
 * @property {string}   laravelApiToken
 * @property {string|null} githubToken   Optional, raises the GitHub API rate limit.
 * @property {number}   maxItems         Cap per run (Gemini free-tier safety).
 * @property {number}   geminiDelayMs    Pause between Gemini calls to respect free-tier RPM.
 * @property {number}   minRelevance     Min focus-keyword score to keep an item (with a safety net).
 * @property {number}   openrouterDays   Only surface OpenRouter models created within this many days.
 * @property {string[]} focusKeywords    Topics we care about (used to rank/filter).
 * @property {string[]} redditSubreddits Subreddits the Reddit collector pulls from.
 * @property {{name:string,url:string,category:string}[]} feeds  RSS/Atom blogs.
 * @property {boolean}  dryRun           When true, never POST — just log payloads.
 */

/**
 * The category whitelist. MUST stay in sync with `app/Enums/FeedCategory.php`
 * — Laravel rejects (422) any category outside this set.
 * @type {string[]}
 */
export const CATEGORIES = [
    'Programming',
    'Artificial Intelligence',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
    'Data Science',
    'Databases',
    'Open Source',
    'Career Advice',
    'Scholarships',
    'Research Papers',
    'Other',
];

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

/**
 * Editorial focus: student development updates about NEW tools and NEW models.
 * Items matching more of these terms rank higher and are preferred when capping.
 * @type {string[]}
 */
export const DEFAULT_FOCUS_KEYWORDS = [
    // "new tool / new model" signal words
    'new', 'launch', 'launches', 'introducing', 'introduces', 'announce', 'announces',
    'announcing', 'release', 'released', 'releases', 'now available', 'preview',
    'open source', 'open-source', 'open sources', 'sdk', 'api', 'toolkit', 'framework',
    'update', 'version', 'v2', 'v3', 'beta', 'general availability',
    // AI / models
    'ai', 'artificial intelligence', 'model', 'models', 'llm', 'gpt', 'agent', 'agents',
    'rag', 'prompt', 'machine learning', 'deep learning', 'multimodal', 'fine-tune',
    'inference', 'embedding', 'reasoning', 'open weights',
    // orgs / products the user named
    'openai', 'anthropic', 'claude', 'gemini', 'google', 'deepmind', 'meta', 'llama',
    'mistral', 'hugging face', 'huggingface', 'n8n', 'openrouter', 'github', 'copilot',
    // dev stack
    'python', 'laravel', 'php', 'react', 'next.js', 'nextjs', 'node', 'typescript',
    'javascript', 'automation', 'workflow', 'whatsapp', 'cloud api', 'webhook',
];

/** Subreddits aligned to the focus above. @type {string[]} */
export const DEFAULT_SUBREDDITS = [
    'AiAutomations', 'LocalLLaMA', 'OpenAI', 'MachineLearning', 'artificial',
];

/**
 * Official developer blogs read by the generic RSS collector. Add a source by
 * appending `{ name, url, category }` here — no code change. (Verified feeds.)
 * @type {{ name: string, url: string, category: string }[]}
 */
export const DEFAULT_FEEDS = [
    { name: 'GitHub Blog', url: 'https://github.blog/feed/', category: 'Open Source' },
    { name: 'GitHub Changelog', url: 'https://github.blog/changelog/feed/', category: 'Programming' },
    { name: 'OpenAI', url: 'https://openai.com/news/rss.xml', category: 'Artificial Intelligence' },
    { name: 'Meta for Developers', url: 'https://developers.facebook.com/blog/feed/', category: 'Programming' },
    { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/', category: 'Artificial Intelligence' },
    { name: 'Google Research', url: 'https://research.google/blog/rss/', category: 'Research Papers' },
    { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: 'Machine Learning' },
    { name: 'n8n', url: 'https://blog.n8n.io/rss/', category: 'DevOps' },
];

/** @param {string|undefined} json @returns {object[]|null} */
function parseJsonList(json) {
    if (!json) return null;
    try {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

/** @param {string|undefined} csv @returns {string[]|null} */
function parseList(csv) {
    if (!csv) return null;
    const list = csv.split(',').map((s) => s.trim()).filter(Boolean);
    return list.length > 0 ? list : null;
}

/**
 * Parse an integer env var, falling back when it is missing, empty, or invalid.
 * (CI passes unset `${{ vars.X }}` as an empty string — not undefined — so `??`
 * is not enough; this guards both empty strings and NaN.)
 * @param {string|undefined} value @param {number} fallback @returns {number}
 */
function intEnv(value, fallback) {
    const n = Number.parseInt(value ?? '', 10);
    return Number.isNaN(n) ? fallback : n;
}

/**
 * Build config from the environment and CLI flags. Throws if required secrets
 * are missing (unless running a dry run, where publishing is skipped).
 *
 * @param {NodeJS.ProcessEnv} [env=process.env]
 * @param {string[]} [argv=process.argv]
 * @returns {Config}
 */
export function loadConfig(env = process.env, argv = process.argv) {
    const dryRun = argv.includes('--dry-run') || env.DRY_RUN === '1' || env.DRY_RUN === 'true';

    const config = {
        geminiApiKey: env.GEMINI_API_KEY ?? '',
        geminiModel: env.GEMINI_MODEL || 'gemini-2.5-flash',
        laravelApiUrl: (env.LARAVEL_API_URL ?? '').replace(/\/+$/, ''),
        laravelApiToken: env.LARAVEL_API_TOKEN ?? '',
        githubToken: env.GITHUB_TOKEN || null,
        maxItems: intEnv(env.MAX_ITEMS, 15),
        geminiDelayMs: intEnv(env.GEMINI_DELAY_MS, 4000),
        minRelevance: intEnv(env.MIN_RELEVANCE, 1),
        openrouterDays: intEnv(env.OPENROUTER_DAYS, 45),
        focusKeywords: parseList(env.FOCUS_KEYWORDS) ?? DEFAULT_FOCUS_KEYWORDS,
        redditSubreddits: parseList(env.REDDIT_SUBREDDITS) ?? DEFAULT_SUBREDDITS,
        feeds: parseJsonList(env.FEEDS) ?? DEFAULT_FEEDS,
        dryRun,
    };

    const missing = [];
    if (!config.geminiApiKey) missing.push('GEMINI_API_KEY');
    if (!config.dryRun && !config.laravelApiUrl) missing.push('LARAVEL_API_URL');
    if (!config.dryRun && !config.laravelApiToken) missing.push('LARAVEL_API_TOKEN');

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return config;
}
