import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminPendingController::index
 * @see app/Http/Controllers/Admin/AdminPendingController.php:13
 * @route '/admin/pending'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminPendingController::index
 * @see app/Http/Controllers/Admin/AdminPendingController.php:13
 * @route '/admin/pending'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPendingController::index
 * @see app/Http/Controllers/Admin/AdminPendingController.php:13
 * @route '/admin/pending'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminPendingController::index
 * @see app/Http/Controllers/Admin/AdminPendingController.php:13
 * @route '/admin/pending'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPendingController::index
 * @see app/Http/Controllers/Admin/AdminPendingController.php:13
 * @route '/admin/pending'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPendingController::index
 * @see app/Http/Controllers/Admin/AdminPendingController.php:13
 * @route '/admin/pending'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminPendingController::index
 * @see app/Http/Controllers/Admin/AdminPendingController.php:13
 * @route '/admin/pending'
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
const pending = {
    index: Object.assign(index, index),
}

export default pending