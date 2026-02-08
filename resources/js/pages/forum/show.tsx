import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, MessageSquare, Send, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ForumPost, SharedData } from '@/types';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    post: ForumPost;
};

export default function ForumShow({ post }: Props) {
    const { auth } = usePage<SharedData>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Community Forum', href: '/forum' },
        { title: post.title, href: `/forum/${post.id}` },
    ];

    const { data, setData, post: postComment, processing, reset, errors } = useForm({
        body: '',
    });

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        postComment(`/forum/${post.id}/comments`, {
            onSuccess: () => reset(),
        });
    };

    const deletePost = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/forum/${post.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
                <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to forum
                </Link>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">{post.user?.name}</span>
                                <span>&middot;</span>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                {post.forum_category && (
                                    <>
                                        <span>&middot;</span>
                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary uppercase">
                                            {post.forum_category.name}
                                        </span>
                                    </>
                                )}
                            </div>
                            <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
                        </div>
                        {(auth.user.id === post.user_id || auth.user.is_admin) && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/forum/${post.id}/edit`}>Edit</Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={deletePost}>
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{post.body}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="size-5" />
                        Comments ({post.forum_comments?.length || 0})
                    </h2>

                    <form onSubmit={submitComment} className="space-y-3">
                        <Textarea
                            placeholder="Write a comment..."
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            className="min-h-[100px]"
                        />
                        {errors.body && <p className="text-sm text-destructive">{errors.body}</p>}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                <Send className="mr-2 size-4" />
                                Post Comment
                            </Button>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {post.forum_comments?.map((comment) => (
                            <div key={comment.id} className="rounded-xl border p-4 bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-semibold">{comment.user?.name}</span>
                                        <span className="text-muted-foreground">&middot;</span>
                                        <span className="text-muted-foreground">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {(auth.user.id === comment.user_id || auth.user.is_admin) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                if (confirm('Delete this comment?')) {
                                                    router.delete(`/forum/comments/${comment.id}`);
                                                }
                                            }}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                </div>
                                <p className="mt-2 text-sm whitespace-pre-wrap">{comment.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
