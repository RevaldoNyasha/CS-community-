import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/resources',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/resources'
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
const resources = {
    index: Object.assign(index, index),
}

export default resources