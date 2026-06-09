import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hackathons',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostController::index
 * @see app/Http/Controllers/PostController.php:18
 * @route '/hackathons'
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
const hackathons = {
    index: Object.assign(index, index),
}

export default hackathons