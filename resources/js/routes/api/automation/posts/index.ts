import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AutomationFeedController::store
 * @see app/Http/Controllers/Api/AutomationFeedController.php:13
 * @route '/api/automation/posts'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/automation/posts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AutomationFeedController::store
 * @see app/Http/Controllers/Api/AutomationFeedController.php:13
 * @route '/api/automation/posts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AutomationFeedController::store
 * @see app/Http/Controllers/Api/AutomationFeedController.php:13
 * @route '/api/automation/posts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AutomationFeedController::store
 * @see app/Http/Controllers/Api/AutomationFeedController.php:13
 * @route '/api/automation/posts'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AutomationFeedController::store
 * @see app/Http/Controllers/Api/AutomationFeedController.php:13
 * @route '/api/automation/posts'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const posts = {
    store: Object.assign(store, store),
}

export default posts