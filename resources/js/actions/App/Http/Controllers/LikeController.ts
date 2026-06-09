import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LikeController::toggle
 * @see app/Http/Controllers/LikeController.php:11
 * @route '/posts/{post}/like'
 */
export const toggle = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/posts/{post}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LikeController::toggle
 * @see app/Http/Controllers/LikeController.php:11
 * @route '/posts/{post}/like'
 */
toggle.url = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { post: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    post: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        post: typeof args.post === 'object'
                ? args.post.slug
                : args.post,
                }

    return toggle.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LikeController::toggle
 * @see app/Http/Controllers/LikeController.php:11
 * @route '/posts/{post}/like'
 */
toggle.post = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LikeController::toggle
 * @see app/Http/Controllers/LikeController.php:11
 * @route '/posts/{post}/like'
 */
    const toggleForm = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LikeController::toggle
 * @see app/Http/Controllers/LikeController.php:11
 * @route '/posts/{post}/like'
 */
        toggleForm.post = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, options),
            method: 'post',
        })
    
    toggle.form = toggleForm
const LikeController = { toggle }

export default LikeController