import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Download, ExternalLink, FileText, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import AuthPromptModal from '@/components/auth-prompt-modal';
import AppLayout from '@/layouts/app-layout';
import { timeAgo } from '@/lib/time-ago';
import type { BreadcrumbItem, Post, SharedData } from '@/types';

type Props = { post: Post };

/* Deterministic avatar colour from a name string */
const AVATAR_COLORS = ['#00f2ff', '#39ff14', '#a78bfa', '#fbbf24', '#f87171', '#34d399'];
function avatarBg(name: string) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name: string) {
    const p = name.trim().split(/\s+/);
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

/* Teal badge colour for "hackathon" type, electric-blue for the rest */
function typeBadgeClass(type: string) {
    if (type === 'hackathon') return 'text-teal-400';
    if (type === 'resource') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-primary/10 text-primary border-primary/20';
}

export default function PostShow({ post }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const backHref = post.type === 'resource' ? '/resources' : post.type === 'hackathon' ? '/hackathons' : post.type === 'project' ? '/projects' : '/dashboard';
    const backLabel = post.type === 'resource' ? 'Resources' : post.type === 'hackathon' ? 'Hackathons' : post.type === 'project' ? 'Projects' : 'Feed';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: backLabel, href: backHref },
    ];

    const { data, setData, post: submitComment, processing, reset, errors } = useForm({ comment: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submitComment(`/posts/${post.slug}/comments`, { onSuccess: () => reset() });
    }

    const authorName = post.user?.name ?? 'Admin';
    const commentCount = post.comments?.length ?? 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">

                {/* ── Sticky sub-nav ── */}
                <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
                    <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                        <Link
                            href={backHref}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            Back to {backLabel}
                        </Link>
                    </div>
                </nav>

                {/* ── Article ── */}
                <main className="max-w-4xl mx-auto px-4 py-6 md:py-12">
                    <article className="space-y-8">

                        {/* Header */}
                        <header className="space-y-6">
                            {/* Type + pending badges */}
                            <div className="flex gap-2">
                                <span className={`text-xs font-bold tracking-wider uppercase ${typeBadgeClass(post.type)}`}>
                                    {post.type}
                                </span>
                                {post.status === 'pending' && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold tracking-wider uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                        Pending
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                                {post.title}
                            </h1>

                            {/* Author row */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-10 w-10 rounded-full flex items-center justify-center font-mono font-bold text-sm text-background shrink-0 ring-2 ring-border"
                                    style={{ backgroundColor: avatarBg(authorName) }}
                                >
                                    {initials(authorName)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground">{authorName}</span>
                                    <span className="text-xs text-muted-foreground">
                                        Published {new Date(post.created_at).toLocaleDateString('en-GB')}
                                        {post.event_date && (
                                            <> · Event: {new Date(post.event_date).toLocaleDateString('en-GB')}</>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </header>

                        {/* Image attachment */}
                        {post.attachment_url && post.attachment_is_image && (
                            <div className="rounded-xl overflow-hidden border border-border">
                                <img
                                    src={post.attachment_url}
                                    alt="Post attachment"
                                    className="w-full object-cover max-h-96"
                                />
                                <div className="px-4 py-2 border-t border-border flex gap-4 bg-card">
                                    <a href={post.attachment_url} target="_blank" rel="noopener noreferrer"
                                        className="text-xs text-primary hover:text-primary/80 font-medium">
                                        Open full size
                                    </a>
                                    <a href={`/posts/${post.slug}/download`}
                                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                                        <Download className="size-3.5" /> Download
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* PDF attachment */}
                        {post.attachment_url && !post.attachment_is_image && (
                            <a href={`/posts/${post.slug}/download`}
                                className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card hover:border-primary/40 transition-colors">
                                <FileText className="size-8 text-destructive shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground text-sm">PDF Attachment</p>
                                    {post.file_size && (
                                        <p className="text-xs text-muted-foreground">{(post.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                    )}
                                </div>
                                <Download className="size-5 text-muted-foreground" />
                            </a>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span key={tag.id} className="px-3 py-1 bg-muted border border-border text-[11px] font-mono font-medium text-muted-foreground rounded-full">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Project link (GitHub / Google Drive) */}
                        {post.github_url && (
                            <a
                                href={post.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card hover:border-violet-500/40 hover:text-violet-400 text-muted-foreground transition-colors text-sm font-medium"
                            >
                                <ExternalLink className="size-4" />
                                View Project
                            </a>
                        )}

                        {/* Body */}
                        <div className="prose prose-invert max-w-none prose-lg prose-slate">
                            {post.content?.split('\n').filter(Boolean).map((para, i) => (
                                <p key={i} className="text-muted-foreground leading-relaxed">{para}</p>
                            ))}
                        </div>
                    </article>

                    {/* ── Divider ── */}
                    <div className="my-16 border-t border-border" />

                    {/* ── Comments ── */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground uppercase tracking-tight">
                                Comments
                                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-sm font-medium normal-case">
                                    {commentCount}
                                </span>
                            </h2>
                        </div>

                        {/* Comment form or login prompt */}
                        {auth.user ? (
                            <form onSubmit={handleSubmit} className="bg-muted/20 border border-border rounded-xl p-4 shadow-sm">
                                <div className="flex flex-col space-y-4">
                                    <textarea
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none text-sm"
                                        placeholder="Write a comment..."
                                        rows={4}
                                    />
                                    {errors.comment && (
                                        <p className="text-xs text-destructive">{errors.comment}</p>
                                    )}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing || !data.comment.trim()}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="w-full flex items-center justify-center gap-3 bg-muted/20 border border-dashed border-border rounded-xl p-6 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                            >
                                <MessageSquare className="size-4" />
                                <span className="text-sm font-medium">Login to Comment</span>
                            </button>
                        )}

                        {/* Comment list or empty state */}
                        {commentCount === 0 ? (
                            <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-2xl bg-background/30">
                                <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl text-muted-foreground/40">chat_bubble_outline</span>
                                </div>
                                <p className="text-muted-foreground font-medium">No comments yet. Be the first to comment.</p>
                                <p className="text-muted-foreground/60 text-sm mt-1">Start a conversation by sharing your thoughts.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {post.comments!.map((comment) => (
                                    <div key={comment.id} className="flex gap-4 p-5 bg-card border border-border rounded-xl">
                                        <div
                                            className="h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center font-mono font-bold text-xs text-background"
                                            style={{ backgroundColor: avatarBg(comment.user?.name ?? '?') }}
                                        >
                                            {initials(comment.user?.name ?? '?')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="font-semibold text-foreground">{comment.user?.name}</span>
                                                    <span className="text-muted-foreground/40">·</span>
                                                    <span className="text-muted-foreground">{timeAgo(comment.created_at)}</span>
                                                </div>
                                                {auth.user && comment.user_id === auth.user.id && (
                                                    <Link
                                                        href={`/comments/${comment.id}`}
                                                        method="delete"
                                                        as="button"
                                                        className="text-xs text-destructive/50 hover:text-destructive transition-colors"
                                                    >
                                                        Delete
                                                    </Link>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{comment.comment}</p>
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
                    <footer className="mt-16 py-12 border-t border-border">
                        <p className="text-muted-foreground/40 text-sm text-center">
                            © {new Date().getFullYear()} DEV-CRAFT Community. Built for developers, by developers.
                        </p>
                    </footer>
                </main>
            </div>
        </AppLayout>
    );
}
