import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Career Guidance', href: '/career-guidance' },
    { title: 'Add Resource', href: '/career-guidance/create' },
];

export default function CareerResourceCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'Internship',
        content: '',
        external_url: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/career-guidance');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Career Resource" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
                <Link href="/career-guidance" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to index
                </Link>

                <div>
                    <h1 className="text-2xl font-bold">Add Career Resource</h1>
                    <p className="text-muted-foreground">Post a new job, internship, or career guide.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Frontend Intern at TechCorp"
                            required
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-medium">Type</label>
                        <select
                            id="type"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            required
                        >
                            <option value="Internship">Internship</option>
                            <option value="Job">Job</option>
                            <option value="Guide">Guide</option>
                            <option value="Event">Event</option>
                        </select>
                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="external_url" className="text-sm font-medium">External URL (Optional)</label>
                        <Input
                            id="external_url"
                            type="url"
                            value={data.external_url}
                            onChange={(e) => setData('external_url', e.target.value)}
                            placeholder="https://example.com/apply"
                        />
                        {errors.external_url && <p className="text-sm text-destructive">{errors.external_url}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">Content / Description</label>
                        <Textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Provide details about the opportunity..."
                            className="min-h-[250px]"
                            required
                        />
                        {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" asChild>
                            <Link href="/career-guidance">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Resource
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
