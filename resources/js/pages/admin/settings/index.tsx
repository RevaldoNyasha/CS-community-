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
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">Settings</h1>
                    <p className="text-muted-foreground">Admin configuration and account settings.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link
                        href="/settings/profile"
                        className="mc-container transition-all hover:brightness-110"
                    >
                        <h3 className="font-semibold uppercase text-brutal-green font-mono">Profile Settings</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Update your name, email, and profile info.</p>
                    </Link>
                    <Link
                        href="/settings/password"
                        className="mc-container transition-all hover:brightness-110"
                    >
                        <h3 className="font-semibold uppercase text-brutal-green font-mono">Password</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Change your account password.</p>
                    </Link>
                    <Link
                        href="/settings/two-factor"
                        className="mc-container transition-all hover:brightness-110"
                    >
                        <h3 className="font-semibold uppercase text-brutal-green font-mono">Two-Factor Authentication</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Add extra security to your account.</p>
                    </Link>
                    <Link
                        href="/settings/appearance"
                        className="mc-container transition-all hover:brightness-110"
                    >
                        <h3 className="font-semibold uppercase text-brutal-green font-mono">Appearance</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Customize theme and appearance.</p>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
