<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Cache;

/**
 * Clears the cached dashboard hero numbers whenever the model is saved or deleted,
 * so they always match the database.
 */
trait FlushesDashboardStats
{
    public const DASHBOARD_STATS_CACHE_KEY = 'dashboard:stats';

    protected static function bootFlushesDashboardStats(): void
    {
        $flush = fn () => Cache::forget(self::DASHBOARD_STATS_CACHE_KEY);

        static::saved($flush);
        static::deleted($flush);
    }
}
