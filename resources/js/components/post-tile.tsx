import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    Heart,
    Megaphone,
    MessageCircle,
    Send,
    Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { MessageRequestDialog } from '@/components/message-request-dialog';
import { COVER_HEIGHT, COVER_WIDTH, postImageUrl } from '@/lib/post-image';
import { tagColor } from '@/lib/tag-color';
import { timeAgo } from '@/lib/time-ago';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

const typeLabel: Record<Post['type'], string> = {
    resource: 'Resource',
    hackathon: 'Hackathon',
    project: 'Project',
    announcement: 'Announcement',
};

// Shown under the cover while it loads, and instead of it if the image fails to load.
const typeArt: Record<Post['type'], { icon: LucideIcon; className: string }> = {
    resource: {
        icon: BookOpen,
        className: 'from-blue-600/40 to-indigo-900/30',
    },
    hackathon: {
        icon: Trophy,
        className: 'from-amber-500/35 to-purple-900/30',
    },
    project: {
        icon: FolderGit2,
        className: 'from-violet-600/40 to-blue-900/30',
    },
    announcement: {
        icon: Megaphone,
        className: 'from-emerald-500/35 to-blue-900/30',
    },
};

/** Plain-text preview of a post body that may contain Markdown. */
function excerpt(content: string) {
    return content
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
        .replace(/[#>*_`~-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function Cover({ post, dimmed }: { post: Post; dimmed: boolean }) {
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const art = typeArt[post.type];

    return (
        <div
            className={cn(
                'relative aspect-[16/7] overflow-hidden bg-linear-to-br',
                art.className,
                dimmed && 'opacity-60 grayscale',
            )}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <art.icon
                    className={cn(
                        'size-10 text-white/30',
                        !loaded && !failed && 'animate-pulse',
                    )}
                    strokeWidth={1.25}
                />
            </div>
            {!failed && (
                <img
                    src={postImageUrl(post)}
                    alt=""
                    width={COVER_WIDTH}
                    height={COVER_HEIGHT}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={() => setFailed(true)}
                    className={cn(
                        'absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]',
                        loaded ? 'opacity-100' : 'opacity-0',
                    )}
                />
            )}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        </div>
    );
}

type Props = {
    post: Post;
    /** Logged-in user's id; hides the message button on your own posts and for guests. */
    viewerId?: number;
    /** Reference time for the "Just listed" badge (read once by the page so renders stay pure). */
    now: number;
    /** Chips shown on the bottom-left of the image (e.g. PDF, event date). */
    badges?: ReactNode;
    /** Extra content at the bottom of the card (e.g. a GitHub link). */
    footer?: ReactNode;
    /** Grey the tile out, e.g. for finished events. */
    dimmed?: boolean;
};

// Post card: uploaded or stock cover, "Just listed" badge, title, preview, author line with
// like and comment counts, then the post's tags. Hovering shows a button to message the author.
export function PostTile({
    post,
    viewerId,
    now,
    badges,
    footer,
    dimmed = false,
}: Props) {
    const isNew = now - new Date(post.created_at).getTime() < DAY_MS;
    const author = post.user;
    const authorName = author?.name ?? 'DEV-CRAFT';
    const canMessage = author && viewerId && author.id !== viewerId;
    const preview = excerpt(post.content ?? '') || typeLabel[post.type];
    const isLiked = post.is_liked;

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_30px_-12px_rgba(26,102,255,0.45)]">
            <Link
                href={`/posts/${post.slug}`}
                prefetch
                className="flex flex-1 flex-col"
            >
                <div className="relative">
                    <Cover post={post} dimmed={dimmed} />
                    {isNew && !dimmed && (
                        <span className="absolute top-2.5 left-2.5 rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-black shadow">
                            Just listed
                        </span>
                    )}
                    {badges && (
                        <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1.5">
                            {badges}
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3">
                    <h3 className="line-clamp-2 text-[15px] leading-snug font-bold">
                        {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                        {preview}
                    </p>

                    <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted-foreground">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-500/80 text-[10px] font-bold text-white uppercase">
                            {authorName.charAt(0)}
                        </span>
                        <span className="min-w-0 truncate">
                            {authorName} · {timeAgo(post.created_at)}
                        </span>
                        <span className="ml-auto flex shrink-0 items-center gap-3">
                            <span className="flex items-center gap-1">
                                <Heart
                                    className={cn(
                                        'size-3.5',
                                        isLiked && 'fill-red-500 text-red-500',
                                    )}
                                />
                                {post.likes_count ?? 0}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="size-3.5" />
                                {post.comments_count ?? 0}
                            </span>
                        </span>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag.id}
                                    className={cn(
                                        'rounded-md px-2 py-0.5 text-[11px] font-medium',
                                        tagColor(tag.name).chip,
                                    )}
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>

            {footer && <div className="px-3.5 pb-3">{footer}</div>}

            <div className="absolute top-2 right-2 flex gap-1.5">
                {canMessage && (
                    <MessageRequestDialog
                        recipient={{ id: author.id, name: author.name }}
                        about={{ id: post.id, title: post.title }}
                    >
                        <button
                            type="button"
                            title={`Message ${author.name}`}
                            className="flex size-8 items-center justify-center rounded-md text-white drop-shadow transition hover:bg-black/40 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                        >
                            <span className="sr-only">
                                Message {author.name}
                            </span>
                            <Send className="size-4" />
                        </button>
                    </MessageRequestDialog>
                )}
            </div>
        </article>
    );
}

/** Small dark chip for use in a tile's `badges`. */
export function TileBadge({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur',
                className,
            )}
        >
            {children}
        </span>
    );
}
