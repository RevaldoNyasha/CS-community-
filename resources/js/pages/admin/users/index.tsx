import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Users', href: '/admin/users' },
];

type Props = {
    users: PaginatedData<User>;
};

export default function AdminUsersIndex({ users }: Props) {
    function handleDelete(user: User) {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    }

    function handlePromote(user: User) {
        if (confirm(`Promote ${user.name} to admin?`)) {
            router.post(`/admin/users/${user.id}/promote`);
        }
    }

    function handleDemote(user: User) {
        if (confirm(`Demote ${user.name} to regular user?`)) {
            router.post(`/admin/users/${user.id}/demote`);
        }
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">Users</h1>
                    <p className="text-muted-foreground">Manage all registered users.</p>
                </div>

                <div className="overflow-x-auto mc-container !p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-3 border-border bg-muted/30">
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Name</th>
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Email</th>
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Role</th>
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Joined</th>
                                <th className="px-4 py-3 text-right font-medium uppercase text-brutal-green font-mono">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id} className="border-b border-border last:border-0">
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 text-xs font-medium uppercase ${
                                            user.role === 'admin'
                                                ? 'bg-brutal-purple/20 text-brutal-purple border-2 border-brutal-purple'
                                                : 'bg-brutal-blue/20 text-brutal-blue border-2 border-brutal-blue'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.role === 'user' ? (
                                                <button
                                                    onClick={() => handlePromote(user)}
                                                    className="mc-btn !py-0.5 !px-2 text-xs"
                                                >
                                                    Promote
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleDemote(user)}
                                                    className="mc-btn mc-btn-gold !py-0.5 !px-2 text-xs"
                                                >
                                                    Demote
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="mc-btn mc-btn-danger !py-0.5 !px-2 text-xs"
                                            >
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
                    <div className="flex justify-center gap-2">
                        {users.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`mc-btn !py-1 !px-3 text-sm ${
                                    link.active
                                        ? 'mc-btn-gold'
                                        : '!bg-card !border-brutal-border !text-foreground'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
