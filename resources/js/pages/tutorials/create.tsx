import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, TutorialCategory } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tutorials', href: '/tutorials' },
    { title: 'Add Tutorial', href: '/tutorials/create' },
];

type Props = {
    categories: TutorialCategory[];
    difficulties: Array<{ value: string; label: string }>;
};

export default function TutorialCreate({ categories, difficulties }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tutorial_category_id: '',
        title: '',
        description: '',
        url: '',
        platform: '',
        difficulty: '',
        is_free: true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/tutorials');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Tutorial" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold tracking-tight">Add Tutorial</h1>

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
                        <label className="mb-1 block text-sm font-medium">Category</label>
                        <select
                            value={data.tutorial_category_id}
                            onChange={(e) => setData('tutorial_category_id', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.tutorial_category_id && <p className="mt-1 text-sm text-red-500">{errors.tutorial_category_id}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">URL</label>
                        <input
                            type="url"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            placeholder="https://..."
                        />
                        {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Platform</label>
                            <input
                                type="text"
                                value={data.platform}
                                onChange={(e) => setData('platform', e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                placeholder="YouTube, Udemy, etc."
                            />
                            {errors.platform && <p className="mt-1 text-sm text-red-500">{errors.platform}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Difficulty</label>
                            <select
                                value={data.difficulty}
                                onChange={(e) => setData('difficulty', e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            >
                                <option value="">Select level</option>
                                {difficulties.map((d) => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                            </select>
                            {errors.difficulty && <p className="mt-1 text-sm text-red-500">{errors.difficulty}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_free"
                            checked={data.is_free}
                            onChange={(e) => setData('is_free', e.target.checked)}
                            className="rounded border"
                        />
                        <label htmlFor="is_free" className="text-sm font-medium">Free resource</label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Tutorial'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
