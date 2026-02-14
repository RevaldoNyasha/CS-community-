import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, Suggestion } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Suggestions', href: '/admin/suggestions' },
];

type Props = {
    suggestions: PaginatedData<Suggestion>;
};

export default function AdminSuggestionsIndex({ suggestions }: Props) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="User Suggestions" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">Suggestions</h1>
                    <p className="text-muted-foreground">User feedback and suggestions.</p>
                </div>

                {suggestions.data.length === 0 ? (
                    <div className="mc-container text-center text-muted-foreground">
                        No suggestions yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {suggestions.data.map((suggestion) => (
                            <div key={suggestion.id} className="mc-container">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-brutal-green font-mono">{suggestion.user?.name ?? 'Unknown'}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(suggestion.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm">{suggestion.message}</p>
                            </div>
                        ))}
                    </div>
                )}

                {suggestions.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {suggestions.links.map((link, i) => (
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
