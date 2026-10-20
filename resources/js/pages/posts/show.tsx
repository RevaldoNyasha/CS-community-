import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Download,
    ExternalLink,
    FileText,
    MessageCircle,
    MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import AuthPromptModal from '@/components/auth-prompt-modal';
import { MessageRequestDialog } from '@/components/message-request-dialog';
import AppLayout from '@/layouts/app-layout';
import { timeAgo } from '@/lib/time-ago';
import type { BreadcrumbItem, Post, SharedData } from '@/types';

type Props = { post: Post };

/* Deterministic avatar colour from a name string */
const AVATAR_COLORS = [
    '#0042ff',
    '#0891b2',
    '#a78bfa',
    '#fbbf24',
    '#f87171',
    '#34d399',
];
function avatarBg(name: string) {
    let h = 0;
    for (let i = 0; i < name.length; i++)
        h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name: string) {
    const p = name.trim().split(/\s+/);
    return p.length >= 2
        ? (p[0][0] + p[1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
}

/* Teal badge colour for "hackathon" type, electric-blue for the rest */
function typeBadgeClass(type: string) {
    if (type === 'hackathon') return 'text-teal-400';
    if (type === 'resource')
        return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-primary/10 text-primary border-primary/20';
}

export default function PostShow({ post }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const backHref =
        post.type === 'resource'
            ? '/resources'
            : post.type === 'hackathon'
              ? '/hackathons'
              : post.type === 'project'
                ? '/projects'
                : '/dashboard';
    const backLabel =
        post.type === 'resource'
            ? 'Resources'
            : post.type === 'hackathon'
              ? 'Hackathons'
              : post.type === 'project'
                ? 'Projects'
                : 'Feed';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: backLabel, href: backHref },
    ];

    const {
        data,
        setData,
        post: submitComment,
        processing,
        reset,
        errors,
    } = useForm({ comment: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submitComment(`/posts/${post.slug}/comments`, {
            onSuccess: () => reset(),
        });
    }

    const authorName = post.user?.name ?? 'Admin';
    const commentCount = post.comments?.length ?? 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Post" />

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
                {/* ── Sticky sub-nav ── */}
                <nav className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                        <Link
                            href={backHref}
                            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">
                                arrow_back
                            </span>
                            Back to {backLabel}
                        </Link>
                    </div>
                </nav>

                {/* ── Article ── */}
                <main className="mx-auto max-w-4xl px-4 py-6 md:py-12">
                    <article className="space-y-8">
                        {/* Header */}
                        <header className="space-y-6">
                            {/* Type + pending badges */}
                            <div className="flex gap-2">
                                <span
                                    className={`text-xs font-bold tracking-wider uppercase ${typeBadgeClass(post.type)}`}
                                >
                                    {post.type}
                                </span>
                                {post.status === 'pending' && (
                                    <span className="inline-flex items-center rounded border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-bold tracking-wider text-yellow-400 uppercase">
                                        Pending
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-xl leading-snug font-bold tracking-tight text-foreground md:text-2xl">
                                {post.title}
                            </h1>

                            {/* Author row */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-background ring-2 ring-border"
                                    style={{
                                        backgroundColor: avatarBg(authorName),
                                    }}
                                >
                                    {initials(authorName)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground">
                                        {authorName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Published{' '}
                                        {new Date(
                                            post.created_at,
                                        ).toLocaleDateString('en-GB')}
                                        {post.event_date && (
                                            <>
                                                {' '}
                                                · Event:{' '}
                                                {new Date(
                                                    post.event_date,
                                                ).toLocaleDateString('en-GB')}
                                            </>
                                        )}
                                    </span>
                                </div>
                                {post.user &&
                                    auth.user &&
                                    post.user.id !== auth.user.id && (
                                        <MessageRequestDialog
                                            recipient={{
                                                id: post.user.id,
                                                name: post.user.name,
                                            }}
                                            about={{
                                                id: post.id,
                                                title: post.title,
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className="ml-auto flex items-center gap-2 rounded-lg bg-secondary px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-secondary/70"
                                            >
                                                <MessageCircle className="size-4" />
                                                Message
                                            </button>
                                        </MessageRequestDialog>
                                    )}
                            </div>
                        </header>

                        {/* Image attachment */}
                        {post.attachment_url && post.attachment_is_image && (
                            <div className="overflow-hidden rounded-xl border border-border">
                                <img
                                    src={post.attachment_url}
                                    alt="Post attachment"
                                    className="max-h-96 w-full object-cover"
                                />
                                <div className="flex gap-4 border-t border-border bg-card px-4 py-2">
                                    <a
                                        href={post.attachment_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-primary hover:text-primary/80"
                                    >
                                        Open full size
                                    </a>
                                    <a
                                        href={`/posts/${post.slug}/download`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                                    >
                                        <Download className="size-3.5" />{' '}
                                        Download
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* PDF attachment */}
                        {post.attachment_url && !post.attachment_is_image && (
                            <a
                                href={`/posts/${post.slug}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                            >
                                <FileText className="size-8 shrink-0 text-destructive" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        PDF Attachment
                                    </p>
                                    {post.file_size && (
                                        <p className="text-xs text-muted-foreground">
                                            {(
                                                post.file_size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{' '}
                                            MB
                                        </p>
                                    )}
                                </div>
                                <Download className="size-5 text-muted-foreground" />
                            </a>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-[11px] font-medium text-muted-foreground"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* External link */}
                        {post.github_url && (
                            <a
                                href={post.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-violet-500/40 hover:text-violet-400"
                            >
                                <ExternalLink className="size-4" />
                                Open Link
                            </a>
                        )}

                        {/* Body */}
                        <div className="max-w-none space-y-4 text-[15px] leading-7">
                            {post.content
                                ?.split('\n')
                                .filter(Boolean)
                                .map((para, i) => (
                                    <p key={i} className="text-foreground/85">
                                        {para}
                                    </p>
                                ))}
                        </div>
                    </article>

                    {/* ── Divider ── */}
                    <div className="my-16 border-t border-border" />

                    {/* ── Comments ── */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                Comments
                                <span className="rounded-full bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground normal-case">
                                    {commentCount}
                                </span>
                            </h2>
                        </div>

                        {/* Comment form or login prompt */}
                        {auth.user ? (
                            <form
                                onSubmit={handleSubmit}
                                className="rounded-xl border border-border bg-muted/20 p-4 shadow-sm"
                            >
                                <div className="flex flex-col space-y-4">
                                    <div>
                                        <textarea
                                            value={data.comment}
                                            onChange={(e) =>
                                                setData(
                                                    'comment',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full resize-none rounded-lg border border-border bg-background p-4 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/50 focus:border-transparent focus:ring-2 focus:ring-primary"
                                            placeholder="Write a comment..."
                                            rows={4}
                                            maxLength={500}
                                        />
                                        <p
                                            className={`mt-1 text-right text-xs tabular-nums ${data.comment.length > 450 ? 'text-destructive' : 'text-muted-foreground'}`}
                                        >
                                            {data.comment.length}/500
                                        </p>
                                    </div>
                                    {errors.comment && (
                                        <p className="text-xs text-destructive">
                                            {errors.comment}
                                        </p>
                                    )}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                !data.comment.trim()
                                            }
                                            className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setAuthModalOpen(true)}
                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
                            >
                                <MessageSquare className="size-4" />
                                <span className="text-sm font-medium">
                                    Login to Comment
                                </span>
                            </button>
                        )}

                        {/* Comment list or empty state */}
                        {commentCount === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-background/30 py-16">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                                    <span className="material-symbols-outlined text-3xl text-muted-foreground/40">
                                        chat_bubble_outline
                                    </span>
                                </div>
                                <p className="font-medium text-muted-foreground">
                                    No comments yet. Be the first to comment.
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground/60">
                                    Start a conversation by sharing your
                                    thoughts.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {post.comments!.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex gap-4 rounded-xl border border-border bg-card p-5"
                                    >
                                        <div
                                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-background"
                                            style={{
                                                backgroundColor: avatarBg(
                                                    comment.user?.name ?? '?',
                                                ),
                                            }}
                                        >
                                            {initials(
                                                comment.user?.name ?? '?',
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="font-semibold text-foreground">
                                                        {comment.user?.name}
                                                    </span>
                                                    <span className="text-muted-foreground/40">
                                                        ·
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {timeAgo(
                                                            comment.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                {auth.user &&
                                                    comment.user_id ===
                                                        auth.user.id && (
                                                        <Link
                                                            href={`/comments/${comment.id}`}
                                                            method="delete"
                                                            as="button"
                                                            className="text-xs text-destructive/50 transition-colors hover:text-destructive"
                                                        >
                                                            Delete
                                                        </Link>
                                                    )}
                                            </div>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {comment.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <AuthPromptModal
                        open={authModalOpen}
                        message="Please login to leave a comment."
                        onCancel={() => setAuthModalOpen(false)}
                    />

                    {/* ── Footer ── */}
                    <footer className="mt-16 border-t border-border py-12">
                        <p className="text-center text-sm text-muted-foreground/40">
                            © {new Date().getFullYear()} DEV-CRAFT Community.
                            Built for developers, by developers.
                        </p>
                    </footer>
                </main>
            </div>
        </AppLayout>
    );
}
