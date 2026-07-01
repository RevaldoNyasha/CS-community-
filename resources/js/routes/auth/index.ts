import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import githubF226c8 from './github'
import google723582 from './google'
/**
* @see \App\Http\Controllers\Auth\GithubAuthController::github
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
export const github = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: github.url(options),
    method: 'get',
})

github.definition = {
    methods: ["get","head"],
    url: '/auth/github',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GithubAuthController::github
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
github.url = (options?: RouteQueryOptions) => {
    return github.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GithubAuthController::github
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
github.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: github.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\GithubAuthController::github
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
github.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: github.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\GithubAuthController::github
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
    const githubForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: github.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\GithubAuthController::github
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
        githubForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: github.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\GithubAuthController::github
 * @see app/Http/Controllers/Auth/GithubAuthController.php:14
 * @route '/auth/github'
 */
        githubForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: github.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    github.form = githubForm
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::google
 * @see app/Http/Controllers/Auth/GoogleAuthController.php:15
 * @route '/auth/google'
 */
export const google = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: google.url(options),
    method: 'get',
})

google.definition = {
    methods: ["get","head"],
    url: '/auth/google',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::google
 * @see app/Http/Controllers/Auth/GoogleAuthController.php:15
 * @route '/auth/google'
 */
google.url = (options?: RouteQueryOptions) => {
    return google.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::google
 * @see app/Http/Controllers/Auth/GoogleAuthController.php:15
 * @route '/auth/google'
 */
google.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: google.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::google
 * @see app/Http/Controllers/Auth/GoogleAuthController.php:15
 * @route '/auth/google'
 */
google.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: google.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\GoogleAuthController::google
 * @see app/Http/Controllers/Auth/GoogleAuthController.php:15
 * @route '/auth/google'
 */
    const googleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: google.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\GoogleAuthController::google
 * @see app/Http/Controllers/Auth/GoogleAuthController.php:15
 * @route '/auth/google'
 */
        googleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: google.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\GoogleAuthController::google
 * @see app/Http/Controllers/Auth/GoogleAuthController.php:15
 * @route '/auth/google'
 */
        googleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: google.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    google.form = googleForm
const auth = {
    github: Object.assign(github, githubF226c8),
google: Object.assign(google, google723582),
}

export default auth