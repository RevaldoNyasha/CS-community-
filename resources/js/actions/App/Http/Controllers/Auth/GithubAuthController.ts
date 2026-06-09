import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\GithubAuthController::redirect
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/auth/github',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GithubAuthController::redirect
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GithubAuthController::redirect
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\GithubAuthController::redirect
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\GithubAuthController::redirect
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
    const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirect.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\GithubAuthController::redirect
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
        redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\GithubAuthController::redirect
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
        redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirect.form = redirectForm
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
const GithubAuthController = { redirect, callback }

export default GithubAuthController