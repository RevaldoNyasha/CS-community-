import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminPostController::index
 * @see app/Http/Controllers/Admin/AdminPostController.php:15
 * @route '/admin/posts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/posts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminPostController::index
 * @see app/Http/Controllers/Admin/AdminPostController.php:15
 * @route '/admin/posts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPostController::index
 * @see app/Http/Controllers/Admin/AdminPostController.php:15
 * @route '/admin/posts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminPostController::index
 * @see app/Http/Controllers/Admin/AdminPostController.php:15
 * @route '/admin/posts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPostController::index
 * @see app/Http/Controllers/Admin/AdminPostController.php:15
 * @route '/admin/posts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPostController::index
 * @see app/Http/Controllers/Admin/AdminPostController.php:15
 * @route '/admin/posts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminPostController::index
 * @see app/Http/Controllers/Admin/AdminPostController.php:15
 * @route '/admin/posts'
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
* @see \App\Http\Controllers\Admin\AdminPostController::approve
 * @see app/Http/Controllers/Admin/AdminPostController.php:31
 * @route '/admin/posts/{post}/approve'
 */
export const approve = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/posts/{post}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminPostController::approve
 * @see app/Http/Controllers/Admin/AdminPostController.php:31
 * @route '/admin/posts/{post}/approve'
 */
approve.url = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPostController::approve
 * @see app/Http/Controllers/Admin/AdminPostController.php:31
 * @route '/admin/posts/{post}/approve'
 */
approve.post = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPostController::approve
 * @see app/Http/Controllers/Admin/AdminPostController.php:31
 * @route '/admin/posts/{post}/approve'
 */
    const approveForm = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPostController::approve
 * @see app/Http/Controllers/Admin/AdminPostController.php:31
 * @route '/admin/posts/{post}/approve'
 */
        approveForm.post = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\AdminPostController::destroy
 * @see app/Http/Controllers/Admin/AdminPostController.php:38
 * @route '/admin/posts/{post}'
 */
export const destroy = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/posts/{post}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminPostController::destroy
 * @see app/Http/Controllers/Admin/AdminPostController.php:38
 * @route '/admin/posts/{post}'
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
* @see \App\Http\Controllers\Admin\AdminPostController::destroy
 * @see app/Http/Controllers/Admin/AdminPostController.php:38
 * @route '/admin/posts/{post}'
 */
destroy.delete = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPostController::destroy
 * @see app/Http/Controllers/Admin/AdminPostController.php:38
 * @route '/admin/posts/{post}'
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
* @see \App\Http\Controllers\Admin\AdminPostController::destroy
 * @see app/Http/Controllers/Admin/AdminPostController.php:38
 * @route '/admin/posts/{post}'
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
const AdminPostController = { index, approve, destroy }

export default AdminPostController