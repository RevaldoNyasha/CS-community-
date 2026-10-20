import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import BrandVideoBackground from '@/components/brand-video-background';
import { useForceDarkTheme } from '@/hooks/use-force-dark-theme';
import { brandStyle } from '@/lib/brand';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const highlights = [
    'Past papers, notes and study guides',
    'Hackathons, from upcoming events to past winners',
    'Projects built and shared by students',
];

function Logo() {
    return (
        <Link href={home()} className="inline-flex items-center gap-3">
            <img
                src="/newIcons/navbarIcon.png"
                alt=""
                className="size-8 object-contain"
            />
            <span className="text-sm font-semibold tracking-widest uppercase">
                DEV-CRAFT
            </span>
        </Link>
    );
}

// Split auth screen matching the welcome page: brand video panel on the left (desktop only),
// form on the right. Always dark and uses the brand blue.
export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    useForceDarkTheme();

    return (
        <div
            className="grid min-h-svh bg-background text-foreground lg:grid-cols-2"
            style={brandStyle}
        >
            {/* ── Brand panel ── */}
            <aside className="relative isolate hidden flex-col justify-between overflow-hidden border-r border-border p-10 lg:flex xl:p-14">
                <BrandVideoBackground
                    overlayClassName="bg-linear-to-b from-background/80 via-background/70 to-background/95"
                    fadeBottom={false}
                />

                <Logo />

                <div>
                    <h2 className="text-4xl font-semibold tracking-tight text-balance xl:text-5xl">
                        Build. Share.
                        <br />
                        <span className="text-primary">Grow together.</span>
                    </h2>
                    <ul className="mt-8 space-y-3">
                        {highlights.map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-3 text-sm text-muted-foreground"
                            >
                                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} DEV-CRAFT · Built by CS
                    students, for CS students
                </p>
            </aside>

            {/* ── Form panel ── */}
            <main className="flex flex-col px-6 py-6 sm:px-10">
                <div className="flex items-center justify-between lg:justify-end">
                    <div className="lg:hidden">
                        <Logo />
                    </div>
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to home
                    </Link>
                </div>

                <div className="mx-auto my-auto w-full max-w-sm py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    {children}
                </div>
            </main>
        </div>
    );
}
