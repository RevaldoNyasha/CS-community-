import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MessageController::index
 * @see app/Http/Controllers/MessageController.php:20
 * @route '/messages'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::index
 * @see app/Http/Controllers/MessageController.php:20
 * @route '/messages'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::index
 * @see app/Http/Controllers/MessageController.php:20
 * @route '/messages'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MessageController::index
 * @see app/Http/Controllers/MessageController.php:20
 * @route '/messages'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MessageController::index
 * @see app/Http/Controllers/MessageController.php:20
 * @route '/messages'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MessageController::index
 * @see app/Http/Controllers/MessageController.php:20
 * @route '/messages'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MessageController::index
 * @see app/Http/Controllers/MessageController.php:20
 * @route '/messages'
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
* @see \App\Http\Controllers\MessageController::preview
 * @see app/Http/Controllers/MessageController.php:61
 * @route '/messages/preview'
 */
export const preview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/messages/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::preview
 * @see app/Http/Controllers/MessageController.php:61
 * @route '/messages/preview'
 */
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::preview
 * @see app/Http/Controllers/MessageController.php:61
 * @route '/messages/preview'
 */
preview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MessageController::preview
 * @see app/Http/Controllers/MessageController.php:61
 * @route '/messages/preview'
 */
preview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MessageController::preview
 * @see app/Http/Controllers/MessageController.php:61
 * @route '/messages/preview'
 */
    const previewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MessageController::preview
 * @see app/Http/Controllers/MessageController.php:61
 * @route '/messages/preview'
 */
        previewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MessageController::preview
 * @see app/Http/Controllers/MessageController.php:61
 * @route '/messages/preview'
 */
        previewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\MessageController::storeRequest
 * @see app/Http/Controllers/MessageController.php:74
 * @route '/messages/requests'
 */
export const storeRequest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRequest.url(options),
    method: 'post',
})

storeRequest.definition = {
    methods: ["post"],
    url: '/messages/requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::storeRequest
 * @see app/Http/Controllers/MessageController.php:74
 * @route '/messages/requests'
 */
storeRequest.url = (options?: RouteQueryOptions) => {
    return storeRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::storeRequest
 * @see app/Http/Controllers/MessageController.php:74
 * @route '/messages/requests'
 */
storeRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRequest.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MessageController::storeRequest
 * @see app/Http/Controllers/MessageController.php:74
 * @route '/messages/requests'
 */
    const storeRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeRequest.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MessageController::storeRequest
 * @see app/Http/Controllers/MessageController.php:74
 * @route '/messages/requests'
 */
        storeRequestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeRequest.url(options),
            method: 'post',
        })
    
    storeRequest.form = storeRequestForm
/**
* @see \App\Http\Controllers\MessageController::send
 * @see app/Http/Controllers/MessageController.php:125
 * @route '/conversations/{conversation}/messages'
 */
export const send = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/conversations/{conversation}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::send
 * @see app/Http/Controllers/MessageController.php:125
 * @route '/conversations/{conversation}/messages'
 */
send.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return send.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::send
 * @see app/Http/Controllers/MessageController.php:125
 * @route '/conversations/{conversation}/messages'
 */
send.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MessageController::send
 * @see app/Http/Controllers/MessageController.php:125
 * @route '/conversations/{conversation}/messages'
 */
    const sendForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MessageController::send
 * @see app/Http/Controllers/MessageController.php:125
 * @route '/conversations/{conversation}/messages'
 */
        sendForm.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(args, options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\MessageController::accept
 * @see app/Http/Controllers/MessageController.php:140
 * @route '/conversations/{conversation}/accept'
 */
export const accept = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/conversations/{conversation}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::accept
 * @see app/Http/Controllers/MessageController.php:140
 * @route '/conversations/{conversation}/accept'
 */
accept.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return accept.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::accept
 * @see app/Http/Controllers/MessageController.php:140
 * @route '/conversations/{conversation}/accept'
 */
accept.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MessageController::accept
 * @see app/Http/Controllers/MessageController.php:140
 * @route '/conversations/{conversation}/accept'
 */
    const acceptForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: accept.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MessageController::accept
 * @see app/Http/Controllers/MessageController.php:140
 * @route '/conversations/{conversation}/accept'
 */
        acceptForm.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: accept.url(args, options),
            method: 'post',
        })
    
    accept.form = acceptForm
/**
* @see \App\Http\Controllers\MessageController::decline
 * @see app/Http/Controllers/MessageController.php:149
 * @route '/conversations/{conversation}/decline'
 */
export const decline = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

decline.definition = {
    methods: ["post"],
    url: '/conversations/{conversation}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MessageController::decline
 * @see app/Http/Controllers/MessageController.php:149
 * @route '/conversations/{conversation}/decline'
 */
decline.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return decline.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::decline
 * @see app/Http/Controllers/MessageController.php:149
 * @route '/conversations/{conversation}/decline'
 */
decline.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MessageController::decline
 * @see app/Http/Controllers/MessageController.php:149
 * @route '/conversations/{conversation}/decline'
 */
    const declineForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: decline.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MessageController::decline
 * @see app/Http/Controllers/MessageController.php:149
 * @route '/conversations/{conversation}/decline'
 */
        declineForm.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: decline.url(args, options),
            method: 'post',
        })
    
    decline.form = declineForm
const MessageController = { index, preview, storeRequest, send, accept, decline }

export default MessageController