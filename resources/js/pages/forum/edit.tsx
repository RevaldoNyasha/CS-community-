import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ForumCategory, ForumPost } from '@/types';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    post: ForumPost;
    categories: ForumCategory[];
};

export default function ForumEdit({ post: forumPost, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Community Forum', href: '/forum' },
        { title: forumPost.title, href: `/forum/${forumPost.id}` },
        { title: 'Edit', href: `/forum/${forumPost.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: forumPost.title,
        forum_category_id: forumPost.forum_category_id,
        body: forumPost.body,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/forum/${forumPost.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${forumPost.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
                <Link href={`/forum/${forumPost.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to post
                </Link>

                <div>
                    <h1 className="text-2xl font-bold">Edit Post</h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                        <select
                            id="category"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={data.forum_category_id}
                            onChange={(e) => setData('forum_category_id', parseInt(e.target.value))}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.forum_category_id && <p className="text-sm text-destructive">{errors.forum_category_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="body" className="text-sm font-medium">Content</label>
                        <Textarea
                            id="body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            className="min-h-[200px]"
                            required
                        />
                        {errors.body && <p className="text-sm text-destructive">{errors.body}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" asChild>
                            <Link href={`/forum/${forumPost.id}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Update Post
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
