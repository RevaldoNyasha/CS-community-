import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminSettingsController::__invoke
 * @see app/Http/Controllers/Admin/AdminSettingsController.php:12
 * @route '/admin/settings'
 */
const AdminSettingsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AdminSettingsController.url(options),
    method: 'get',
})

AdminSettingsController.definition = {
    methods: ["get","head"],
    url: '/admin/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminSettingsController::__invoke
 * @see app/Http/Controllers/Admin/AdminSettingsController.php:12
 * @route '/admin/settings'
 */
AdminSettingsController.url = (options?: RouteQueryOptions) => {
    return AdminSettingsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminSettingsController::__invoke
 * @see app/Http/Controllers/Admin/AdminSettingsController.php:12
 * @route '/admin/settings'
 */
AdminSettingsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AdminSettingsController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminSettingsController::__invoke
 * @see app/Http/Controllers/Admin/AdminSettingsController.php:12
 * @route '/admin/settings'
 */
AdminSettingsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: AdminSettingsController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminSettingsController::__invoke
 * @see app/Http/Controllers/Admin/AdminSettingsController.php:12
 * @route '/admin/settings'
 */
    const AdminSettingsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: AdminSettingsController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminSettingsController::__invoke
 * @see app/Http/Controllers/Admin/AdminSettingsController.php:12
 * @route '/admin/settings'
 */
        AdminSettingsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: AdminSettingsController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminSettingsController::__invoke
 * @see app/Http/Controllers/Admin/AdminSettingsController.php:12
 * @route '/admin/settings'
 */
        AdminSettingsControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: AdminSettingsController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    AdminSettingsController.form = AdminSettingsControllerForm
export default AdminSettingsController