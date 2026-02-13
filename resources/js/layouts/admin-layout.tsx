import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AdminSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AdminSidebarLayout>
);
