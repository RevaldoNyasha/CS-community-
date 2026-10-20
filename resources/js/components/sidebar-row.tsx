import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    href?: string;
    onClick?: () => void;
    trailing?: ReactNode;
};

// A Marketplace-style sidebar row: round icon, label, optional trailing badge or chevron.
// Renders a link when `href` is given, otherwise a button.
export function SidebarRow({
    icon: Icon,
    label,
    active = false,
    href,
    onClick,
    trailing,
}: Props) {
    const className = cn(
        'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[15px] font-medium transition-colors',
        active ? 'bg-secondary' : 'hover:bg-secondary/60',
    );

    const content = (
        <>
            <span
                className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
                    active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground',
                )}
            >
                <Icon className="size-[18px]" />
            </span>
            <span className="flex-1 truncate">{label}</span>
            {trailing}
        </>
    );

    return href ? (
        <Link
            href={href}
            prefetch
            aria-current={active ? 'page' : undefined}
            className={className}
        >
            {content}
        </Link>
    ) : (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={className}
        >
            {content}
        </button>
    );
}
