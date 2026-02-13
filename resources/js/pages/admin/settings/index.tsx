import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Settings', href: '/admin/settings' },
];

export default function AdminSettingsIndex() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Admin configuration and account settings.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link
                        href="/settings/profile"
                        className="rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                    >
                        <h3 className="font-semibold">Profile Settings</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Update your name, email, and profile info.</p>
                    </Link>
                    <Link
                        href="/settings/password"
                        className="rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                    >
                        <h3 className="font-semibold">Password</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Change your account password.</p>
                    </Link>
                    <Link
                        href="/settings/two-factor"
                        className="rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                    >
                        <h3 className="font-semibold">Two-Factor Authentication</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Add extra security to your account.</p>
                    </Link>
                    <Link
                        href="/settings/appearance"
                        className="rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                    >
                        <h3 className="font-semibold">Appearance</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Customize theme and appearance.</p>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
