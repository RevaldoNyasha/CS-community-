import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, User } from '@/types';
import { index as adminUsersIndex, resetPassword as adminUsersResetPassword } from '@/routes/admin/users/index';

type Props = {
    user: User;
    newPassword: string | null;
};

const inputClass =
    'w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-colors';

export default function AdminUserShow({ user, newPassword }: Props) {
    const [copied, setCopied] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Users', href: adminUsersIndex() },
        { title: user.name },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(adminUsersResetPassword(user).url, {
            onSuccess: () => reset('password'),
        });
    }

    function handleCopy() {
        if (!newPassword) {
            return;
        }
        navigator.clipboard.writeText(newPassword).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`User — ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">{user.name}</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">User details and password management.</p>
                </div>

                {/* User info card */}
                <div className="bg-card border border-border rounded-lg p-5 grid gap-3 sm:grid-cols-2">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Name</p>
                        <p className="text-sm text-foreground">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</p>
                        <p className="text-sm text-foreground">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Role</p>
                        <span
                            className={`px-2 py-0.5 text-[10px] font-medium uppercase rounded ${
                                user.role === 'admin'
                                    ? 'border border-purple-500/30 bg-purple-500/10 text-purple-400'
                                    : 'border border-primary/30 bg-primary/10 text-primary'
                            }`}
                        >
                            {user.role}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Joined</p>
                        <p className="text-sm text-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* New password display — shown after a successful reset */}
                {newPassword && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-5 flex flex-col gap-3">
                        <p className="text-xs font-semibold text-green-400 uppercase tracking-[0.15em]">Password reset successfully</p>
                        <p className="text-xs text-muted-foreground">Copy this password and send it to the user manually — it will not be shown again.</p>
                        <div className="flex items-center gap-3">
                            <code className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground select-all">
                                {newPassword}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 border border-green-500/40 bg-green-500/10 text-green-400 text-xs font-semibold rounded-md hover:bg-green-500/20 transition-all whitespace-nowrap"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Password reset form */}
                <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-5">
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Reset Password</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Set a new temporary password for this user. They can change it later in their settings.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]">
                                New Password
                            </label>
                            <input
                                type="text"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                className={inputClass}
                                autoComplete="off"
                            />
                            {errors.password && (
                                <p className="text-xs text-red-400">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing || !data.password}
                                className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:brightness-110 disabled:opacity-50 transition-all"
                            >
                                {processing ? 'Resetting…' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
