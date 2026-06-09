import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
const index774ead24894370c05401c7139893044f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index774ead24894370c05401c7139893044f.url(options),
    method: 'get',
})

index774ead24894370c05401c7139893044f.definition = {
    methods: ["get","head"],
    url: '/resources',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
index774ead24894370c05401c7139893044f.url = (options?: RouteQueryOptions) => {
    return index774ead24894370c05401c7139893044f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
index774ead24894370c05401c7139893044f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index774ead24894370c05401c7139893044f.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
index774ead24894370c05401c7139893044f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index774ead24894370c05401c7139893044f.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
    const index774ead24894370c05401c7139893044fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index774ead24894370c05401c7139893044f.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
        index774ead24894370c05401c7139893044fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index774ead24894370c05401c7139893044f.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
        index774ead24894370c05401c7139893044fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index774ead24894370c05401c7139893044f.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index774ead24894370c05401c7139893044f.form = index774ead24894370c05401c7139893044fForm
    /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
const index9a3a2bca7dbedc99b90de44e555cfefb = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9a3a2bca7dbedc99b90de44e555cfefb.url(options),
    method: 'get',
})

index9a3a2bca7dbedc99b90de44e555cfefb.definition = {
    methods: ["get","head"],
    url: '/hackathons',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
index9a3a2bca7dbedc99b90de44e555cfefb.url = (options?: RouteQueryOptions) => {
    return index9a3a2bca7dbedc99b90de44e555cfefb.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
index9a3a2bca7dbedc99b90de44e555cfefb.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9a3a2bca7dbedc99b90de44e555cfefb.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
index9a3a2bca7dbedc99b90de44e555cfefb.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index9a3a2bca7dbedc99b90de44e555cfefb.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
    const index9a3a2bca7dbedc99b90de44e555cfefbForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index9a3a2bca7dbedc99b90de44e555cfefb.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
        index9a3a2bca7dbedc99b90de44e555cfefbForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index9a3a2bca7dbedc99b90de44e555cfefb.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
        index9a3a2bca7dbedc99b90de44e555cfefbForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index9a3a2bca7dbedc99b90de44e555cfefb.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index9a3a2bca7dbedc99b90de44e555cfefb.form = index9a3a2bca7dbedc99b90de44e555cfefbForm
    /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/projects'
 */
const index8f35706c95c06c991312479b995e49d2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index8f35706c95c06c991312479b995e49d2.url(options),
    method: 'get',
})

index8f35706c95c06c991312479b995e49d2.definition = {
    methods: ["get","head"],
    url: '/projects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/projects'
 */
index8f35706c95c06c991312479b995e49d2.url = (options?: RouteQueryOptions) => {
    return index8f35706c95c06c991312479b995e49d2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/projects'
 */
index8f35706c95c06c991312479b995e49d2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index8f35706c95c06c991312479b995e49d2.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/projects'
 */
index8f35706c95c06c991312479b995e49d2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index8f35706c95c06c991312479b995e49d2.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/projects'
 */
    const index8f35706c95c06c991312479b995e49d2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index8f35706c95c06c991312479b995e49d2.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/projects'
 */
        index8f35706c95c06c991312479b995e49d2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index8f35706c95c06c991312479b995e49d2.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/projects'
 */
        index8f35706c95c06c991312479b995e49d2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index8f35706c95c06c991312479b995e49d2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index8f35706c95c06c991312479b995e49d2.form = index8f35706c95c06c991312479b995e49d2Form

export const index = {
    '/resources': index774ead24894370c05401c7139893044f,
    '/hackathons': index9a3a2bca7dbedc99b90de44e555cfefb,
    '/projects': index8f35706c95c06c991312479b995e49d2,
}

/**
* @see \App\Http\Controllers\PostController::create
 * @see app/Http/Controllers/PostController.php:108
 * @route '/posts/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/posts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostController::create
 * @see app/Http/Controllers/PostController.php:108
 * @route '/posts/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::create
 * @see app/Http/Controllers/PostController.php:108
 * @route '/posts/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostController::create
 * @see app/Http/Controllers/PostController.php:108
 * @route '/posts/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostController::create
 * @see app/Http/Controllers/PostController.php:108
 * @route '/posts/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostController::create
 * @see app/Http/Controllers/PostController.php:108
 * @route '/posts/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostController::create
 * @see app/Http/Controllers/PostController.php:108
 * @route '/posts/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\PostController::show
 * @see app/Http/Controllers/PostController.php:150
 * @route '/posts/{post}'
 */
export const show = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/posts/{post}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostController::show
 * @see app/Http/Controllers/PostController.php:150
 * @route '/posts/{post}'
 */
show.url = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::show
 * @see app/Http/Controllers/PostController.php:150
 * @route '/posts/{post}'
 */
show.get = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostController::show
 * @see app/Http/Controllers/PostController.php:150
 * @route '/posts/{post}'
 */
show.head = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostController::show
 * @see app/Http/Controllers/PostController.php:150
 * @route '/posts/{post}'
 */
    const showForm = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostController::show
 * @see app/Http/Controllers/PostController.php:150
 * @route '/posts/{post}'
 */
        showForm.get = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostController::show
 * @see app/Http/Controllers/PostController.php:150
 * @route '/posts/{post}'
 */
        showForm.head = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\PostController::download
 * @see app/Http/Controllers/PostController.php:168
 * @route '/posts/{post}/download'
 */
export const download = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/posts/{post}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostController::download
 * @see app/Http/Controllers/PostController.php:168
 * @route '/posts/{post}/download'
 */
download.url = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::download
 * @see app/Http/Controllers/PostController.php:168
 * @route '/posts/{post}/download'
 */
download.get = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostController::download
 * @see app/Http/Controllers/PostController.php:168
 * @route '/posts/{post}/download'
 */
download.head = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostController::download
 * @see app/Http/Controllers/PostController.php:168
 * @route '/posts/{post}/download'
 */
    const downloadForm = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostController::download
 * @see app/Http/Controllers/PostController.php:168
 * @route '/posts/{post}/download'
 */
        downloadForm.get = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostController::download
 * @see app/Http/Controllers/PostController.php:168
 * @route '/posts/{post}/download'
 */
        downloadForm.head = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\PostController::store
 * @see app/Http/Controllers/PostController.php:113
 * @route '/posts'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/posts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PostController::store
 * @see app/Http/Controllers/PostController.php:113
 * @route '/posts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::store
 * @see app/Http/Controllers/PostController.php:113
 * @route '/posts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PostController::store
 * @see app/Http/Controllers/PostController.php:113
 * @route '/posts'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PostController::store
 * @see app/Http/Controllers/PostController.php:113
 * @route '/posts'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const PostController = { index, create, show, download, store }

export default PostController