import { arxiv } from './arxiv.js';
import { devto } from './devto.js';
import { githubTrending } from './githubTrending.js';
import { hackernews } from './hackernews.js';
import { reddit } from './reddit.js';

/**
 * A normalized item produced by every collector.
 * @typedef {Object} RawItem
 * @property {string}      title
 * @property {string}      description
 * @property {string}      url
 * @property {string}      source
 * @property {string|null} image
 * @property {string|null} author
 * @property {string|null} publishedAt  ISO date string, if known.
 */

/**
 * A content source. Implement `collect()` and add it to the registry below —
 * the pipeline treats every collector identically (open/closed principle).
 * @typedef {Object} Collector
 * @property {string} name                                  Human-readable source name.
 * @property {string} category                              Fallback category hint.
 * @property {(config?: import('../config.js').Config) => Promise<RawItem[]>} collect
 */

/**
 * The active collectors. Add a new file + one line here to extend coverage.
 * @type {Collector[]}
 */
export const collectors = [hackernews, devto, reddit, githubTrending, arxiv];
