import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Users', href: '/admin/users' },
];

const btnPromote = 'px-3 py-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-md hover:bg-emerald-500/20 transition-all';
const btnDemote = 'px-3 py-1 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-md hover:bg-amber-500/20 transition-all';
const btnDanger = 'px-3 py-1 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold rounded-md hover:bg-red-500/20 transition-all';

type DialogState = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmVariant: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
};

const defaultDialog: DialogState = {
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'danger',
    onConfirm: () => {},
};

type Props = {
    users: PaginatedData<User>;
};

export default function AdminUsersIndex({ users }: Props) {
    const [dialog, setDialog] = useState<DialogState>(defaultDialog);

    function closeDialog() {
        setDialog((d) => ({ ...d, open: false }));
    }

    function handleDelete(user: User) {
        setDialog({
            open: true,
            title: 'Delete User',
            description: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
            confirmLabel: 'Delete',
            confirmVariant: 'danger',
            onConfirm: () => {
                closeDialog();
                router.delete(`/admin/users/${user.id}`);
            },
        });
    }

    function handlePromote(user: User) {
        setDialog({
            open: true,
            title: 'Promote to Admin',
            description: `Grant admin privileges to "${user.name}"? They will have full access to the admin panel.`,
            confirmLabel: 'Promote',
            confirmVariant: 'primary',
            onConfirm: () => {
                closeDialog();
                router.post(`/admin/users/${user.id}/promote`);
            },
        });
    }

    function handleDemote(user: User) {
        setDialog({
            open: true,
            title: 'Demote User',
            description: `Remove admin privileges from "${user.name}"? They will become a regular user.`,
            confirmLabel: 'Demote',
            confirmVariant: 'warning',
            onConfirm: () => {
                closeDialog();
                router.post(`/admin/users/${user.id}/demote`);
            },
        });
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Users</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage all registered users.</p>
                </div>

                <div className="overflow-x-auto bg-card border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-secondary/20">
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Name</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Role</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Joined</th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/10 transition-colors">
                                    <td className="px-5 py-3 font-medium text-foreground">{user.name}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2 py-0.5 text-[10px] font-medium uppercase rounded ${
                                            user.role === 'admin'
                                                ? 'border border-purple-500/30 bg-purple-500/10 text-purple-400'
                                                : 'border border-primary/30 bg-primary/10 text-primary'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.role === 'user' ? (
                                                <button onClick={() => handlePromote(user)} className={btnPromote}>
                                                    Promote
                                                </button>
                                            ) : (
                                                <button onClick={() => handleDemote(user)} className={btnDemote}>
                                                    Demote
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(user)} className={btnDanger}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.last_page > 1 && (
                    <div className="flex justify-center gap-1.5">
                        {users.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                                    link.active
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={dialog.open}
                title={dialog.title}
                description={dialog.description}
                confirmLabel={dialog.confirmLabel}
                confirmVariant={dialog.confirmVariant}
                onConfirm={dialog.onConfirm}
                onCancel={closeDialog}
            />
        </AdminLayout>
    );
}
