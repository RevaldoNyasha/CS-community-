import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Announcements', href: '/announcements' },
    { title: 'New Announcement', href: '/announcements/create' },
];

export default function AnnouncementCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body: '',
        is_pinned: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/announcements');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Announcement" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
                <Link href="/announcements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to announcements
                </Link>

                <div>
                    <h1 className="text-2xl font-bold">New Announcement</h1>
                    <p className="text-muted-foreground">Broadcast news to the entire community.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. End of Semester Examinations"
                            required
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="body" className="text-sm font-medium">Body Content</label>
                        <Textarea
                            id="body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Provide full details of the announcement..."
                            className="min-h-[250px]"
                            required
                        />
                        {errors.body && <p className="text-sm text-destructive">{errors.body}</p>}
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="is_pinned"
                            checked={data.is_pinned}
                            onCheckedChange={(checked) => setData('is_pinned', checked as boolean)}
                        />
                        <label
                            htmlFor="is_pinned"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Pin this announcement to the top
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" asChild>
                            <Link href="/announcements">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Publish Announcement
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
