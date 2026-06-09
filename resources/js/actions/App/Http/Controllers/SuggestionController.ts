import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:13
 * @route '/suggestions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/suggestions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:13
 * @route '/suggestions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:13
 * @route '/suggestions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:13
 * @route '/suggestions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:13
 * @route '/suggestions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:13
 * @route '/suggestions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:13
 * @route '/suggestions'
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
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:25
 * @route '/suggestions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/suggestions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:25
 * @route '/suggestions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:25
 * @route '/suggestions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:25
 * @route '/suggestions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:25
 * @route '/suggestions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const SuggestionController = { index, store }

export default SuggestionController