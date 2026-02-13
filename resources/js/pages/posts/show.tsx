import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Post, SharedData } from '@/types';

type Props = {
    post: Post;
};

export default function PostShow({ post }: Props) {
    const { auth } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: post.type === 'resource' ? 'Resources' : post.type === 'hackathon' ? 'Hackathons' : 'Posts', href: post.type === 'resource' ? '/resources' : '/hackathons' },
        { title: post.title, href: `/posts/${post.id}` },
    ];

    const { data, setData, post: submitComment, processing, reset, errors } = useForm({
        comment: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submitComment(`/posts/${post.id}/comments`, {
            onSuccess: () => reset(),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Link
                    href={post.type === 'resource' ? '/resources' : '/hackathons'}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back
                </Link>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                            {post.type}
                        </span>
                        {post.status === 'pending' && (
                            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                Pending
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>By {post.user?.name ?? 'Admin'}</span>
                        <span>&middot;</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</div>

                    {post.attachment_url && (
                        <div className="mt-4">
                            {post.attachment_is_image ? (
                                <div className="space-y-2">
                                    <img
                                        src={post.attachment_url}
                                        alt="Post attachment"
                                        className="max-h-96 rounded-lg border border-sidebar-border/70 object-contain"
                                    />
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={post.attachment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                        >
                                            Open full size
                                        </a>
                                        <a
                                            href={`/posts/${post.id}/download`}
                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                        >
                                            <Download className="size-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <a
                                    href={`/posts/${post.id}/download`}
                                    className="inline-flex items-center gap-3 rounded-lg border border-sidebar-border/70 px-4 py-3 text-sm hover:bg-muted/50 dark:border-sidebar-border"
                                >
                                    <FileText className="size-8 text-red-500" />
                                    <div>
                                        <p className="font-medium">PDF Attachment</p>
                                        {post.file_size && (
                                            <p className="text-xs text-muted-foreground">
                                                {(post.file_size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        )}
                                    </div>
                                    <Download className="ml-2 size-4 text-muted-foreground" />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-semibold">
                        Comments ({post.comments?.length ?? 0})
                    </h2>

                    <form onSubmit={handleSubmit} className="mb-4 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <textarea
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                            placeholder="Write a comment..."
                        />
                        {errors.comment && <p className="mt-1 text-sm text-destructive">{errors.comment}</p>}
                        <Button type="submit" disabled={processing} size="sm" className="mt-2">
                            Post Comment
                        </Button>
                    </form>

                    {(!post.comments || post.comments.length === 0) ? (
                        <div className="rounded-xl border border-sidebar-border/70 p-6 text-center text-muted-foreground dark:border-sidebar-border">
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {post.comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium">{comment.user?.name}</span>
                                            <span className="text-muted-foreground">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {(comment.user_id === auth.user.id || auth.isAdmin) && (
                                            <Link
                                                href={`/comments/${comment.id}`}
                                                method="delete"
                                                as="button"
                                                className="text-xs text-destructive hover:underline"
                                            >
                                                Delete
                                            </Link>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm">{comment.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
