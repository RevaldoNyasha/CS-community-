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
 * @property {string[]} focusKeywords    Topics we care about (used to rank/filter).
 * @property {string[]} redditSubreddits Subreddits the Reddit collector pulls from.
 * @property {string[]} devtoTags        Dev.to tags the Dev.to collector pulls from.
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
 * Editorial focus — what this community cares about. Items matching more of
 * these terms rank higher and are preferred when capping per run.
 * @type {string[]}
 */
export const DEFAULT_FOCUS_KEYWORDS = [
    'ai', 'artificial intelligence', 'agent', 'llm', 'gpt', 'rag', 'prompt',
    'machine learning', 'deep learning', 'neural', 'transformer', 'embedding',
    'ai engineering', 'mlops', 'fine-tune', 'inference', 'openai', 'anthropic',
    'gemini', 'llama', 'mistral', 'hugging face',
    'whatsapp', 'cloud api', 'messaging api', 'webhook',
    'web development', 'framework', 'react', 'next.js', 'nextjs', 'vue', 'svelte',
    'angular', 'tailwind', 'node', 'typescript', 'javascript',
    'python', 'django', 'fastapi', 'flask',
    'laravel', 'php', 'livewire', 'inertia',
    'meta', 'google', 'deepmind', 'microsoft', 'aws', 'cloudflare', 'vercel',
];

/** Subreddits aligned to the focus above. @type {string[]} */
export const DEFAULT_SUBREDDITS = [
    'MachineLearning', 'LocalLLaMA', 'artificial', 'OpenAI',
    'webdev', 'Python', 'laravel', 'programming',
];

/** Dev.to tags aligned to the focus above. @type {string[]} */
export const DEFAULT_DEVTO_TAGS = [
    'ai', 'machinelearning', 'python', 'laravel', 'webdev', 'react', 'javascript',
];

/** @param {string|undefined} csv @returns {string[]|null} */
function parseList(csv) {
    if (!csv) return null;
    const list = csv.split(',').map((s) => s.trim()).filter(Boolean);
    return list.length > 0 ? list : null;
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
        geminiModel: env.GEMINI_MODEL ?? 'gemini-flash-latest',
        laravelApiUrl: (env.LARAVEL_API_URL ?? '').replace(/\/+$/, ''),
        laravelApiToken: env.LARAVEL_API_TOKEN ?? '',
        githubToken: env.GITHUB_TOKEN || null,
        maxItems: Number.parseInt(env.MAX_ITEMS ?? '15', 10),
        geminiDelayMs: Number.parseInt(env.GEMINI_DELAY_MS ?? '4000', 10),
        minRelevance: Number.parseInt(env.MIN_RELEVANCE ?? '1', 10),
        focusKeywords: parseList(env.FOCUS_KEYWORDS) ?? DEFAULT_FOCUS_KEYWORDS,
        redditSubreddits: parseList(env.REDDIT_SUBREDDITS) ?? DEFAULT_SUBREDDITS,
        devtoTags: parseList(env.DEVTO_TAGS) ?? DEFAULT_DEVTO_TAGS,
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
