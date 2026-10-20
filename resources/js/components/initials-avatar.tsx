import { cn } from '@/lib/utils';

const COLORS = [
    '#0042ff',
    '#0891b2',
    '#7c3aed',
    '#d97706',
    '#dc2626',
    '#059669',
    '#db2777',
];

function colorFor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);

    return COLORS[Math.abs(hash) % COLORS.length];
}

function initials(name: string) {
    const parts = name.trim().split(/\s+/);

    return (
        parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)
    ).toUpperCase();
}

// Round avatar with the person's initials on a colour derived from their name.
export function InitialsAvatar({
    name,
    className,
}: {
    name: string;
    className?: string;
}) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white select-none',
                className,
            )}
            style={{ backgroundColor: colorFor(name) }}
        >
            {initials(name)}
        </span>
    );
}
