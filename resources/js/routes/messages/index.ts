import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import requests from './requests'
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
const messages = {
    index: Object.assign(index, index),
preview: Object.assign(preview, preview),
requests: Object.assign(requests, requests),
}

export default messages