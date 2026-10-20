import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import messages from './messages'
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
const conversations = {
    messages: Object.assign(messages, messages),
accept: Object.assign(accept, accept),
decline: Object.assign(decline, decline),
}

export default conversations