import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, ExternalLink, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, CareerResource, PaginatedData, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Career Guidance', href: '/career-guidance' },
];

type Props = {
    resources: PaginatedData<CareerResource>;
    filters: {
        type?: string;
        search?: string;
    };
};

export default function CareerGuidanceIndex({ resources, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilter(key: string, value: string) {
        router.get('/career-guidance', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilter('search', search);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Career Guidance" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Career Guidance</h1>
                        <p className="text-muted-foreground">Find internships, jobs, and career development resources.</p>
                    </div>
                    {auth.user.is_admin && (
                        <Button asChild>
                            <Link href="/career-guidance/create">
                                <Plus className="mr-2 size-4" />
                                Add Resource
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search career resources..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    <select
                        value={filters.type ?? ''}
                        onChange={(e) => applyFilter('type', e.target.value)}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <option value="">All Types</option>
                        <option value="Internship">Internships</option>
                        <option value="Job">Jobs</option>
                        <option value="Guide">Guides</option>
                        <option value="Event">Events</option>
                    </select>
                </div>

                {resources.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                        No resources found. Check back later!
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {resources.data.map((resource) => (
                            <div
                                key={resource.id}
                                className="group flex flex-col rounded-xl border p-5 transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Briefcase className="size-5" />
                                    </div>
                                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-muted-foreground uppercase">
                                        {resource.type}
                                    </span>
                                </div>
                                <h2 className="mt-4 text-xl font-bold line-clamp-1">{resource.title}</h2>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                                    {resource.content}
                                </p>
                                <div className="mt-4 flex items-center justify-between border-t pt-4">
                                    <span className="text-xs text-muted-foreground">
                                        Posted {new Date(resource.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/career-guidance/${resource.id}`}>Read More</Link>
                                        </Button>
                                        {resource.external_url && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="size-4" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {resources.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {resources.links.map((link, i) => (
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
