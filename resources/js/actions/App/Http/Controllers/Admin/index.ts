import AdminDashboardController from './AdminDashboardController'
import AdminUserController from './AdminUserController'
import AdminPostController from './AdminPostController'
import AdminPendingController from './AdminPendingController'
import AdminSuggestionController from './AdminSuggestionController'
import AdminAnnouncementController from './AdminAnnouncementController'
import AdminSettingsController from './AdminSettingsController'
const Admin = {
    AdminDashboardController: Object.assign(AdminDashboardController, AdminDashboardController),
AdminUserController: Object.assign(AdminUserController, AdminUserController),
AdminPostController: Object.assign(AdminPostController, AdminPostController),
AdminPendingController: Object.assign(AdminPendingController, AdminPendingController),
AdminSuggestionController: Object.assign(AdminSuggestionController, AdminSuggestionController),
AdminAnnouncementController: Object.assign(AdminAnnouncementController, AdminAnnouncementController),
AdminSettingsController: Object.assign(AdminSettingsController, AdminSettingsController),
}

export default Admin