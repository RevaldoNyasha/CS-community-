import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Plus, Search, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, SharedData, StudyResource, Subject } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Study Resources',
        href: '/study-resources',
    },
];

type Props = {
    resources: PaginatedData<StudyResource>;
    subjects: Subject[];
    filters: {
        search?: string;
        type?: string;
        subject_id?: string;
    };
};

export default function Index({ resources, subjects, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const { data, setData, get } = useForm({
        search: filters.search || '',
        type: filters.type || '',
        subject_id: filters.subject_id || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/study-resources', { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Study Resources" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Study Resources</h1>
                        <p className="text-muted-foreground">Access past exam papers, lecture notes, and modules.</p>
                    </div>
                    <Button asChild>
                        <Link href="/study-resources/create">
                            <Plus className="mr-2 size-4" />
                            Upload Resource
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search resources..."
                            className="pl-9"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                    </div>
                    <select
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={data.subject_id}
                        onChange={(e) => setData('subject_id', e.target.value)}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.code} - {subject.name}
                            </option>
                        ))}
                    </select>
                    <Button type="submit" variant="secondary">
                        <Filter className="mr-2 size-4" />
                        Filter
                    </Button>
                </form>

                {resources.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                        No resources found.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {resources.data.map((resource) => (
                            <div
                                key={resource.id}
                                className="flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary uppercase">
                                            {resource.type.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Part {resource.subject?.part} • Sem {resource.semester}
                                        </span>
                                    </div>
                                    <h2 className="mt-2 text-lg font-bold line-clamp-1">{resource.title}</h2>
                                    <p className="mt-1 text-sm text-muted-foreground font-medium">
                                        {resource.subject?.code} - {resource.subject?.name}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                        {resource.description || 'No description provided.'}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t pt-4">
                                    <div className="text-xs text-muted-foreground">
                                        By {resource.user?.name}
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/study-resources/${resource.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
