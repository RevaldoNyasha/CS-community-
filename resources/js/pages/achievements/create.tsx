import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Achievements', href: '/achievements' },
    { title: 'Share Achievement', href: '/achievements/create' },
];

export default function AchievementCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image_path: '',
        achieved_at: new Date().toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/achievements');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Share Achievement" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
                <Link href="/achievements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to achievements
                </Link>

                <div>
                    <h1 className="text-2xl font-bold">Share Achievement</h1>
                    <p className="text-muted-foreground">Showcase your project, award, or success story.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Winner of NUST Hackathon 2025"
                            required
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="achieved_at" className="text-sm font-medium">Date Achieved</label>
                        <Input
                            id="achieved_at"
                            type="date"
                            value={data.achieved_at}
                            onChange={(e) => setData('achieved_at', e.target.value)}
                            required
                        />
                        {errors.achieved_at && <p className="text-sm text-destructive">{errors.achieved_at}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image_path" className="text-sm font-medium">Image URL (Optional)</label>
                        <Input
                            id="image_path"
                            type="url"
                            value={data.image_path}
                            onChange={(e) => setData('image_path', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                        {errors.image_path && <p className="text-sm text-destructive">{errors.image_path}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">Full Description</label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Tell the story behind this achievement..."
                            className="min-h-[200px]"
                            required
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" asChild>
                            <Link href="/achievements">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Share Achievement
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
