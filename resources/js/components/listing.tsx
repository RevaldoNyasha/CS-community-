import { Link, usePage } from '@inertiajs/react';
import { Plus, Search, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import AuthPromptModal from '@/components/auth-prompt-modal';
import { cn } from '@/lib/utils';
import type { PaginatedData, SharedData } from '@/types';

/* Shared building blocks for the Resources, Hackathons and Projects listing pages. */

export const tileGridClass =
    'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

type HeaderProps = {
    title: string;
    search: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    addLabel: string;
    guestMessage: string;
    /** Extra filter controls shown next to the search box. */
    filters?: ReactNode;
};

export function ListingHeader({
    title,
    search,
    onSearchChange,
    searchPlaceholder,
    addLabel,
    guestMessage,
    filters,
}: HeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const addClass =
        'flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90';

    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>

            <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full rounded-full border-0 bg-secondary py-2 pr-9 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            aria-label="Clear search"
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {filters}

                {auth.user ? (
                    <Link href="/posts/create" className={addClass}>
                        <Plus className="size-4" />
                        {addLabel}
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={() => setAuthModalOpen(true)}
                        className={addClass}
                    >
                        <Plus className="size-4" />
                        {addLabel}
                    </button>
                )}
            </div>

            <AuthPromptModal
                open={authModalOpen}
                message={guestMessage}
                onCancel={() => setAuthModalOpen(false)}
            />
        </div>
    );
}

/** A pill-shaped on/off filter, e.g. "PDF only". */
export function FilterChip({
    active,
    onClick,
    icon: Icon,
    children,
}: {
    active: boolean;
    onClick: () => void;
    icon?: LucideIcon;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/70',
            )}
        >
            {Icon && <Icon className="size-4" />}
            {children}
        </button>
    );
}

export function SectionHeading({ title }: { title: string }) {
    return <h2 className="mb-4 text-xl font-semibold">{title}</h2>;
}

export function ListingEmpty({
    icon: Icon,
    title,
    message,
}: {
    icon: LucideIcon;
    title: string;
    message: string;
}) {
    return (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-border bg-card px-6 text-center">
            <Icon
                className="size-16 text-muted-foreground/40"
                strokeWidth={1}
            />
            <p className="mt-5 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

export function ListingPagination<T>({ data }: { data: PaginatedData<T> }) {
    if (data.last_page <= 1) return null;

    return (
        <nav
            aria-label="Pagination"
            className="mt-10 flex flex-wrap justify-center gap-2"
        >
            {data.links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? '#'}
                    preserveScroll={false}
                    className={cn(
                        'min-w-10 rounded-full px-3.5 py-2 text-center text-sm font-semibold transition-colors',
                        link.active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground hover:bg-secondary/70',
                        !link.url && 'pointer-events-none opacity-40',
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}

export function ListingFooter() {
    return (
        <footer className="mt-16 border-t border-border pt-6 pb-2 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} DEV-CRAFT · Developed by Cyber Squad
            (NUST)
        </footer>
    );
}
