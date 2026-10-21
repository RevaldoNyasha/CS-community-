import { AdminSideNav } from '@/components/admin-side-nav';
import AppTopnavLayout from '@/layouts/app/app-topnav-layout';
import type { AppLayoutProps } from '@/types';

// Admin area: the app frame with the admin sections in the sidebar.
export default function AdminLayout({ children, ...props }: AppLayoutProps) {
    return (
        <AppTopnavLayout {...props} sidebarSection={<AdminSideNav />}>
            {children}
        </AppTopnavLayout>
    );
}
