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
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Settings</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Admin configuration and account settings.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link
                        href="/settings/profile"
                        className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group shadow-sm"
                    >
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Profile Settings</h3>
                        <p className="mt-1 text-xs text-muted-foreground">Update your name, email, and profile info.</p>
                    </Link>
                    <Link
                        href="/settings/password"
                        className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group shadow-sm"
                    >
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Password</h3>
                        <p className="mt-1 text-xs text-muted-foreground">Change your account password.</p>
                    </Link>
                    <Link
                        href="/settings/two-factor"
                        className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group shadow-sm"
                    >
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Two-Factor Authentication</h3>
                        <p className="mt-1 text-xs text-muted-foreground">Add extra security to your account.</p>
                    </Link>
                    <Link
                        href="/settings/appearance"
                        className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group shadow-sm"
                    >
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Appearance</h3>
                        <p className="mt-1 text-xs text-muted-foreground">Customize theme and appearance.</p>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
