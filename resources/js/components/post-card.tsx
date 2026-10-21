import { Link, router } from '@inertiajs/react';
import { MessageCircle, MoreVertical, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { timeAgo } from '@/lib/time-ago';
import type { Post } from '@/types';

type Props = {
    post: Post;
};

/* Deterministic color for the squared avatar */
const AVATAR_COLORS = [
    { bg: '#1a66ff', text: '#ffffff' }, // brand blue
    { bg: '#0891b2', text: '#ffffff' }, // teal
    { bg: '#7c3aed', text: '#ffffff' }, // purple
    { bg: '#f59e0b', text: '#0a0a0a' }, // amber
    { bg: '#ef4444', text: '#ffffff' }, // red
    { bg: '#10b981', text: '#ffffff' }, // emerald
    { bg: '#3b82f6', text: '#ffffff' }, // blue
    { bg: '#ec4899', text: '#ffffff' }, // pink
];

function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* Get first two uppercase chars for the squared avatar */
function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

export default function PostCard({ post }: Props) {
    const [detailOpen, setDetailOpen] = useState(false);

    function handleLike(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/posts/${post.slug}/like`, {}, { preserveScroll: true });
    }

    function handleCardClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDetailOpen(true);
    }

    const authorName = post.user?.name ?? 'Unknown';
    const style = avatarColor(authorName);
    const image =
        post.attachment_is_image && post.attachment_url
            ? post.attachment_url
            : null;

    return (
        <>
            <article
                className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-primary/40"
                onClick={handleCardClick}
            >
                <div className="p-6">
                    {/* ── Header ── */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {/* Circular monogram avatar */}
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold select-none"
                                style={{
                                    backgroundColor: style.bg,
                                    color: style.text,
                                }}
                            >
                                {initials(authorName)}
                            </div>
                            <div>
                                <Link href={`/posts/${post.slug}`}>
                                    <h4 className="line-clamp-1 text-[15px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
                                        {post.title}
                                    </h4>
                                </Link>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {authorName} · {timeAgo(post.created_at)}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDetailOpen(true)}
                            className="p-1 text-muted-foreground/50 transition-colors hover:text-foreground"
                        >
                            <MoreVertical className="size-4" />
                        </button>
                    </div>

                    {/* ── Image ── */}
                    {image && (
                        <div
                            className="mt-4"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <img
                                src={image}
                                alt={post.title}
                                className="max-h-56 w-full rounded-md object-cover"
                            />
                        </div>
                    )}

                    {/* ── Body ── */}
                    {post.content && (
                        <div className="mt-4">
                            <p className="line-clamp-4 text-sm leading-relaxed text-secondary-foreground">
                                {post.content}
                            </p>
                        </div>
                    )}

                    {/* ── Tags ── */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.slice(0, 1).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                            {post.tags.slice(1).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* ── Footer ── */}
                    <div className="mt-6 flex items-center gap-6 border-t border-border pt-4 text-muted-foreground">
                        <button
                            type="button"
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-red-400 ${post.is_liked ? 'text-red-400' : ''}`}
                        >
                            <ThumbsUp
                                className={`size-[18px] ${post.is_liked ? 'fill-current' : ''}`}
                            />
                            {post.likes_count ?? 0}
                        </button>
                        <Link
                            href={`/posts/${post.slug}`}
                            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MessageCircle className="size-[18px]" />
                            {(post.comments_count ?? 0) > 0
                                ? `${post.comments_count} Comments`
                                : 'Comments'}
                        </Link>
                    </div>
                </div>
            </article>

            {/* ── Detail Modal ── */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-h-[85vh] !gap-0 overflow-hidden rounded-xl border border-border bg-card !p-0 sm:max-w-2xl">
                    <DialogTitle className="sr-only">{post.title}</DialogTitle>

                    <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                        <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold select-none"
                            style={{
                                backgroundColor: style.bg,
                                color: style.text,
                            }}
                        >
                            {initials(authorName)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                                {post.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {authorName} · {timeAgo(post.created_at)}
                            </p>
                        </div>
                    </div>

                    {image && (
                        <img
                            src={image}
                            alt={post.title}
                            className="max-h-56 w-full object-cover"
                        />
                    )}

                    <div className="overflow-y-auto p-5">
                        <p className="mb-4 text-sm leading-relaxed whitespace-pre-wrap text-secondary-foreground">
                            {post.content}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-5 border-t border-border pt-3 text-muted-foreground">
                            <button
                                type="button"
                                onClick={handleLike}
                                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-red-400 ${post.is_liked ? 'text-red-400' : ''}`}
                            >
                                <ThumbsUp
                                    className={`size-4 ${post.is_liked ? 'fill-current' : ''}`}
                                />
                                {post.likes_count ?? 0} Likes
                            </button>
                            <Link
                                href={`/posts/${post.slug}`}
                                className="ml-auto text-sm font-semibold text-primary hover:text-primary/80"
                            >
                                Open →
                            </Link>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
