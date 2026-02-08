import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, Plus } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Tutorial, TutorialCategory } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tutorials', href: '/tutorials' },
];

type Props = {
    tutorials: PaginatedData<Tutorial>;
    categories: TutorialCategory[];
    difficulties: Array<{ value: string; label: string }>;
    filters: {
        category_id?: string;
        search?: string;
    };
};

const difficultyColors: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function TutorialsIndex({ tutorials, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilter(key: string, value: string) {
        router.get('/tutorials', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilter('search', search);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tutorials" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tutorials</h1>
                        <p className="text-muted-foreground">Curated tutorials and learning resources.</p>
                    </div>
                    <Link
                        href="/tutorials/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="size-4" />
                        Add Tutorial
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search tutorials..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 rounded-lg border bg-background px-3 text-sm"
                        />
                    </form>

                    <select
                        value={filters.category_id ?? ''}
                        onChange={(e) => applyFilter('category_id', e.target.value)}
                        className="h-9 rounded-lg border bg-background px-3 text-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {tutorials.data.length === 0 ? (
                    <div className="rounded-xl border p-8 text-center text-muted-foreground">
                        No tutorials found. Try adjusting your filters.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tutorials.data.map((tutorial) => (
                            <div
                                key={tutorial.id}
                                className="flex flex-col rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[tutorial.difficulty] ?? ''}`}>
                                        {tutorial.difficulty}
                                    </span>
                                    {tutorial.is_free && (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                            Free
                                        </span>
                                    )}
                                    {tutorial.tutorial_category && (
                                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-muted-foreground">
                                            {tutorial.tutorial_category.name}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold">{tutorial.title}</h3>
                                <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">
                                    {tutorial.description}
                                </p>
                                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{tutorial.platform}</span>
                                    <a
                                        href={tutorial.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        Open <ExternalLink className="size-3" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tutorials.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {tutorials.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : link.url
                                          ? 'hover:bg-accent'
                                          : 'cursor-default text-muted-foreground'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
