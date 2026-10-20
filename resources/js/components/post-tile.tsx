import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    Megaphone,
    MessageCircle,
    Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { MessageRequestDialog } from '@/components/message-request-dialog';
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

// Placeholder look for posts without an image, per post type.
const typeArt: Record<Post['type'], { icon: LucideIcon; className: string }> = {
    resource: {
        icon: BookOpen,
        className: 'from-[#0042ff]/40 to-[#0042ff]/5',
    },
    hackathon: {
        icon: Trophy,
        className: 'from-amber-500/40 to-amber-500/5',
    },
    project: {
        icon: FolderGit2,
        className: 'from-violet-500/40 to-violet-500/5',
    },
    announcement: {
        icon: Megaphone,
        className: 'from-emerald-500/40 to-emerald-500/5',
    },
};

type Props = {
    post: Post;
    /** Logged-in user's id; hides the message button on your own posts and for guests. */
    viewerId?: number;
    /** Reference time for the "Just listed" badge (read once by the page so renders stay pure). */
    now: number;
    /** Chips shown on the bottom-left of the image (e.g. PDF, event date). */
    badges?: ReactNode;
    /** Extra content under the author line (e.g. a GitHub link). */
    footer?: ReactNode;
    /** Grey the tile out, e.g. for finished events. */
    dimmed?: boolean;
};

// Marketplace-style post tile: square image or type placeholder, bold title, preview line,
// author and time. Hovering shows a button to message the author.
export function PostTile({
    post,
    viewerId,
    now,
    badges,
    footer,
    dimmed = false,
}: Props) {
    const image =
        post.attachment_is_image && post.attachment_url
            ? post.attachment_url
            : null;
    const art = typeArt[post.type];
    const isNew = now - new Date(post.created_at).getTime() < DAY_MS;
    const author = post.user;
    const canMessage = author && viewerId && author.id !== viewerId;

    return (
        <div className="group relative">
            <Link href={`/posts/${post.slug}`} prefetch className="block">
                <div
                    className={cn(
                        'relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary',
                        dimmed && 'opacity-60 grayscale',
                    )}
                >
                    {image ? (
                        <img
                            src={image}
                            alt=""
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div
                            className={cn(
                                'flex size-full items-center justify-center bg-linear-to-br',
                                art.className,
                            )}
                        >
                            <art.icon
                                className="size-14 text-foreground/40"
                                strokeWidth={1.25}
                            />
                        </div>
                    )}
                    {isNew && !dimmed && (
                        <span className="absolute top-2 left-2 rounded-md bg-white px-2 py-0.5 text-xs font-medium text-black shadow">
                            Just listed
                        </span>
                    )}
                    {badges && (
                        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
                            {badges}
                        </div>
                    )}
                </div>
                <p className="mt-2 line-clamp-1 text-base font-semibold">
                    {post.title}
                </p>
                <p className="line-clamp-1 text-sm text-foreground/85">
                    {post.content || typeLabel[post.type]}
                </p>
                <p className="line-clamp-1 text-[13px] text-muted-foreground">
                    {author?.name ?? 'DEV-CRAFT'} · {timeAgo(post.created_at)}
                </p>
            </Link>

            {footer}

            {canMessage && (
                <MessageRequestDialog
                    recipient={{ id: author.id, name: author.name }}
                    about={{ id: post.id, title: post.title }}
                >
                    <button
                        type="button"
                        title={`Message ${author.name}`}
                        className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-opacity hover:bg-black/75 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                    >
                        <span className="sr-only">Message {author.name}</span>
                        <MessageCircle className="size-4" />
                    </button>
                </MessageRequestDialog>
            )}
        </div>
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
