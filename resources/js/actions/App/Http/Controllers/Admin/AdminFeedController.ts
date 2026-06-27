import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminFeedController::index
 * @see app/Http/Controllers/Admin/AdminFeedController.php:15
 * @route '/admin/feed'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/feed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminFeedController::index
 * @see app/Http/Controllers/Admin/AdminFeedController.php:15
 * @route '/admin/feed'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminFeedController::index
 * @see app/Http/Controllers/Admin/AdminFeedController.php:15
 * @route '/admin/feed'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminFeedController::index
 * @see app/Http/Controllers/Admin/AdminFeedController.php:15
 * @route '/admin/feed'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminFeedController::index
 * @see app/Http/Controllers/Admin/AdminFeedController.php:15
 * @route '/admin/feed'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminFeedController::index
 * @see app/Http/Controllers/Admin/AdminFeedController.php:15
 * @route '/admin/feed'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminFeedController::index
 * @see app/Http/Controllers/Admin/AdminFeedController.php:15
 * @route '/admin/feed'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\AdminFeedController::destroy
 * @see app/Http/Controllers/Admin/AdminFeedController.php:29
 * @route '/admin/feed/{feedItem}'
 */
export const destroy = (args: { feedItem: string | { slug: string } } | [feedItem: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/feed/{feedItem}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminFeedController::destroy
 * @see app/Http/Controllers/Admin/AdminFeedController.php:29
 * @route '/admin/feed/{feedItem}'
 */
destroy.url = (args: { feedItem: string | { slug: string } } | [feedItem: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { feedItem: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    feedItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        feedItem: typeof args.feedItem === 'object'
                ? args.feedItem.slug
                : args.feedItem,
                }

    return destroy.definition.url
            .replace('{feedItem}', parsedArgs.feedItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminFeedController::destroy
 * @see app/Http/Controllers/Admin/AdminFeedController.php:29
 * @route '/admin/feed/{feedItem}'
 */
destroy.delete = (args: { feedItem: string | { slug: string } } | [feedItem: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminFeedController::destroy
 * @see app/Http/Controllers/Admin/AdminFeedController.php:29
 * @route '/admin/feed/{feedItem}'
 */
    const destroyForm = (args: { feedItem: string | { slug: string } } | [feedItem: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminFeedController::destroy
 * @see app/Http/Controllers/Admin/AdminFeedController.php:29
 * @route '/admin/feed/{feedItem}'
 */
        destroyForm.delete = (args: { feedItem: string | { slug: string } } | [feedItem: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AdminFeedController = { index, destroy }

export default AdminFeedController