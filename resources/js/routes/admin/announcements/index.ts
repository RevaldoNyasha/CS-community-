import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::index
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:17
 * @route '/admin/announcements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/announcements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::index
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:17
 * @route '/admin/announcements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::index
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:17
 * @route '/admin/announcements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::index
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:17
 * @route '/admin/announcements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::index
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:17
 * @route '/admin/announcements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::index
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:17
 * @route '/admin/announcements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::index
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:17
 * @route '/admin/announcements'
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
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::store
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:31
 * @route '/admin/announcements'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/announcements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::store
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:31
 * @route '/admin/announcements'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::store
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:31
 * @route '/admin/announcements'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::store
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:31
 * @route '/admin/announcements'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::store
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:31
 * @route '/admin/announcements'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::destroy
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:43
 * @route '/admin/announcements/{post}'
 */
export const destroy = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/announcements/{post}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::destroy
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:43
 * @route '/admin/announcements/{post}'
 */
destroy.url = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { post: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    post: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        post: typeof args.post === 'object'
                ? args.post.slug
                : args.post,
                }

    return destroy.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::destroy
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:43
 * @route '/admin/announcements/{post}'
 */
destroy.delete = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::destroy
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:43
 * @route '/admin/announcements/{post}'
 */
    const destroyForm = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAnnouncementController::destroy
 * @see app/Http/Controllers/Admin/AdminAnnouncementController.php:43
 * @route '/admin/announcements/{post}'
 */
        destroyForm.delete = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const announcements = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default announcements