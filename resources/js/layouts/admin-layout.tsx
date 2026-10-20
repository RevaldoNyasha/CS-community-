import { AdminSideNav } from '@/components/admin-side-nav';
import AppTopnavLayout from '@/layouts/app/app-topnav-layout';
import type { AppLayoutProps } from '@/types';

// Admin area: the app's top navbar plus the admin section sidebar.
export default function AdminLayout({ children, ...props }: AppLayoutProps) {
    return (
        <AppTopnavLayout {...props} sidebar={<AdminSideNav />}>
            {children}
        </AppTopnavLayout>
    );
}
