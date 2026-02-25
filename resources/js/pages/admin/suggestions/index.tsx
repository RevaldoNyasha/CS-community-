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
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Suggestions</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">User feedback and suggestions.</p>
                </div>

                {suggestions.data.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
                        No suggestions yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {suggestions.data.map((suggestion) => (
                            <div key={suggestion.id} className="bg-card border border-border rounded-lg p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-foreground">{suggestion.user?.name ?? 'Unknown'}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(suggestion.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{suggestion.message}</p>
                            </div>
                        ))}
                    </div>
                )}

                {suggestions.last_page > 1 && (
                    <div className="flex justify-center gap-1.5">
                        {suggestions.links.map((link, i) => (
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
        </AdminLayout>
    );
}
