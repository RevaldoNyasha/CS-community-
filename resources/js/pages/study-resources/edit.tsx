import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, StudyResource, Subject } from '@/types';

type Props = {
    resource: StudyResource;
    subjects: Subject[];
    types: Array<{ value: string; label: string }>;
};

export default function StudyResourceEdit({ resource, subjects, types }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Study Resources', href: '/study-resources' },
        { title: 'Edit', href: `/study-resources/${resource.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        subject_id: resource.subject_id.toString(),
        title: resource.title,
        description: resource.description ?? '',
        type: resource.type,
        external_url: resource.external_url ?? '',
        year: resource.year.toString(),
        semester: resource.semester.toString(),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/study-resources/${resource.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Resource" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold tracking-tight">Edit Resource</h1>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Subject</label>
                        <select
                            value={data.subject_id}
                            onChange={(e) => setData('subject_id', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select a subject</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.code} - {s.name} (Part {s.part})</option>
                            ))}
                        </select>
                        {errors.subject_id && <p className="mt-1 text-sm text-red-500">{errors.subject_id}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Type</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select type</option>
                            {types.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">External URL</label>
                        <input
                            type="url"
                            value={data.external_url}
                            onChange={(e) => setData('external_url', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Year</label>
                            <input
                                type="number"
                                value={data.year}
                                onChange={(e) => setData('year', e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Semester</label>
                            <select
                                value={data.semester}
                                onChange={(e) => setData('semester', e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            >
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Update Resource'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
