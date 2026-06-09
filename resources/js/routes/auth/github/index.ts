import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\GithubAuthController::callback
 * @see app/Http/Controllers/Auth/GithubAuthController.php:19
 * @route '/auth/github/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/auth/github/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GithubAuthController::callback
 * @see app/Http/Controllers/Auth/GithubAuthController.php:19
 * @route '/auth/github/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GithubAuthController::callback
 * @see app/Http/Controllers/Auth/GithubAuthController.php:19
 * @route '/auth/github/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\GithubAuthController::callback
 * @see app/Http/Controllers/Auth/GithubAuthController.php:19
 * @route '/auth/github/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\GithubAuthController::callback
 * @see app/Http/Controllers/Auth/GithubAuthController.php:19
 * @route '/auth/github/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\GithubAuthController::callback
 * @see app/Http/Controllers/Auth/GithubAuthController.php:19
 * @route '/auth/github/callback'
 */
        callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\GithubAuthController::callback
 * @see app/Http/Controllers/Auth/GithubAuthController.php:19
 * @route '/auth/github/callback'
 */
        callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    callback.form = callbackForm
const github = {
    callback: Object.assign(callback, callback),
}

export default github