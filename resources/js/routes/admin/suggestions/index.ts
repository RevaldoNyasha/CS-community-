import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminSuggestionController::index
 * @see app/Http/Controllers/Admin/AdminSuggestionController.php:13
 * @route '/admin/suggestions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/suggestions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminSuggestionController::index
 * @see app/Http/Controllers/Admin/AdminSuggestionController.php:13
 * @route '/admin/suggestions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminSuggestionController::index
 * @see app/Http/Controllers/Admin/AdminSuggestionController.php:13
 * @route '/admin/suggestions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminSuggestionController::index
 * @see app/Http/Controllers/Admin/AdminSuggestionController.php:13
 * @route '/admin/suggestions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminSuggestionController::index
 * @see app/Http/Controllers/Admin/AdminSuggestionController.php:13
 * @route '/admin/suggestions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminSuggestionController::index
 * @see app/Http/Controllers/Admin/AdminSuggestionController.php:13
 * @route '/admin/suggestions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminSuggestionController::index
 * @see app/Http/Controllers/Admin/AdminSuggestionController.php:13
 * @route '/admin/suggestions'
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
const suggestions = {
    index: Object.assign(index, index),
}

export default suggestions