import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Compass,
    Menu,
    Share2,
    UserPlus,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import BrandVideoBackground from '@/components/brand-video-background';
import { useForceDarkTheme } from '@/hooks/use-force-dark-theme';
import { brandStyle } from '@/lib/brand';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

const navLinks = [
    { label: 'Resources', href: '/resources' },
    { label: 'Hackathons', href: '/hackathons' },
    { label: 'Projects', href: '/projects' },
];

const steps: {
    icon: LucideIcon;
    title: string;
    description: string;
    tags: string[];
}[] = [
    {
        icon: UserPlus,
        title: 'Create your account',
        description: 'Sign up in seconds with Google, GitHub or email.',
        tags: ['Google', 'GitHub', 'Email'],
    },
    {
        icon: Compass,
        title: 'Explore and request',
        description:
            'Find materials, browse hackathons and ask for anything that is missing.',
        tags: ['Resources', 'Hackathons', 'Requests'],
    },
    {
        icon: Share2,
        title: 'Contribute back',
        description:
            'Share notes and projects so the next class has it easier than you did.',
        tags: ['Notes', 'Projects', 'Past papers'],
    },
];

const DECK_INTERVAL_MS = 4500;

// Resting place of each card in the stack: 0 is the front card, later ones peek out above it.
const stackPositions = [
    { transform: 'translateY(0) scale(1)', opacity: 1, zIndex: 30 },
    { transform: 'translateY(-20px) scale(0.95)', opacity: 0.7, zIndex: 20 },
    { transform: 'translateY(-40px) scale(0.9)', opacity: 0.4, zIndex: 10 },
];

const exploreItems = [
    { title: 'Resources', note: 'Past papers, notes and guides' },
    { title: 'Hackathons', note: 'Upcoming events and past winners' },
    { title: 'Projects', note: 'Built by students' },
];

// "How it works" as a shuffling card deck. Every few seconds the front card flies out and
// tucks in behind the stack, bringing the next step forward.
function HowItWorksDeck() {
    const [active, setActive] = useState(0);
    const [leaving, setLeaving] = useState<number | null>(null);
    const [reduceMotion] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    useEffect(() => {
        if (reduceMotion) return;

        const timer = window.setTimeout(() => {
            setLeaving(active);
            setActive((active + 1) % steps.length);
        }, DECK_INTERVAL_MS);

        return () => window.clearTimeout(timer);
    }, [active, reduceMotion]);

    return (
        <div>
            <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-semibold text-primary">
                    How it works
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Up and running in three steps
                </h2>
            </div>

            {/* The deck: extra top room so the cards behind can peek out */}
            <div className="relative mx-auto mt-14 h-80 max-w-xl sm:h-72">
                {steps.map((step, index) => {
                    const position =
                        (index - active + steps.length) % steps.length;
                    const resting = stackPositions[position];
                    const isFront = position === 0;
                    const isLeaving = index === leaving && !reduceMotion;

                    return (
                        <article
                            key={step.title}
                            aria-hidden={!isFront}
                            onAnimationEnd={() => setLeaving(null)}
                            className={`absolute inset-x-0 bottom-0 flex h-[calc(100%-2.5rem)] flex-col overflow-hidden rounded-2xl border bg-card p-7 shadow-2xl shadow-black/40 transition-[transform,opacity,border-color] duration-500 ease-out motion-reduce:transition-none sm:p-8 ${
                                isFront ? 'border-primary/40' : 'border-border'
                            }`}
                            style={
                                {
                                    transform: resting.transform,
                                    opacity: resting.opacity,
                                    zIndex: resting.zIndex,
                                    '--deck-end': resting.transform,
                                    '--deck-end-opacity': resting.opacity,
                                    animation: isLeaving
                                        ? 'deck-shuffle 850ms cubic-bezier(0.45, 0, 0.2, 1)'
                                        : undefined,
                                } as React.CSSProperties
                            }
                        >
                            {/* Large faded step number in the corner */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-2 -bottom-8 text-[9rem] leading-none font-bold text-foreground/[0.04] select-none"
                            >
                                {index + 1}
                            </span>

                            <div className="flex items-center justify-between">
                                <span className="text-primary">
                                    <step.icon
                                        className="size-7"
                                        strokeWidth={1.75}
                                    />
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Step {index + 1} of {steps.length}
                                </span>
                            </div>

                            <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                                {step.title}
                            </h3>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                                {step.description}
                            </p>

                            <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                {step.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    useForceDarkTheme();

    const primaryCta = auth.user
        ? { label: 'Go to dashboard', href: dashboard().url }
        : { label: 'Join the community', href: register().url };

    return (
        <>
            <Head title="DEV-CRAFT" />

            <div
                className="relative min-h-screen overflow-x-hidden bg-background text-foreground"
                style={brandStyle}
            >
                {/* Video backdrop spans the nav and hero */}
                <div className="relative isolate">
                    <BrandVideoBackground />

                    {/* ── Nav ── */}
                    <header className="relative z-50">
                        <nav
                            aria-label="Global"
                            className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8"
                        >
                            <Link
                                href="/"
                                className="-m-1.5 flex items-center gap-3 p-1.5"
                            >
                                <img
                                    src="/newIcons/navbarIcon.png"
                                    alt=""
                                    className="size-8 object-contain"
                                />
                                <span className="text-sm font-semibold tracking-widest uppercase">
                                    DEV-CRAFT
                                </span>
                            </Link>

                            <div className="hidden items-center gap-8 lg:flex">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="hidden items-center gap-5 lg:flex">
                                {auth.user ? (
                                    <Link
                                        href={dashboard().url}
                                        className="rounded-md bg-[#0042FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0042FF]/90"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login().url}
                                            className="text-sm font-semibold transition-colors hover:text-muted-foreground"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={register().url}
                                            className="rounded-md bg-[#0042FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0042FF]/90"
                                        >
                                            Get started
                                        </Link>
                                    </>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground lg:hidden"
                            >
                                <span className="sr-only">Open main menu</span>
                                <Menu className="size-6" aria-hidden="true" />
                            </button>
                        </nav>

                        {/* Mobile menu panel */}
                        {mobileMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40 bg-black/40"
                                    onClick={() => setMobileMenuOpen(false)}
                                />
                                <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-border">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href="/"
                                            className="-m-1.5 flex items-center gap-3 p-1.5"
                                        >
                                            <img
                                                src="/newIcons/navbarIcon.png"
                                                alt=""
                                                className="size-8 object-contain"
                                            />
                                            <span className="text-sm font-semibold tracking-widest uppercase">
                                                DEV-CRAFT
                                            </span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
                                        >
                                            <span className="sr-only">
                                                Close menu
                                            </span>
                                            <X
                                                className="size-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    <div className="mt-6 divide-y divide-border">
                                        <div className="space-y-1 py-6">
                                            {navLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold hover:bg-secondary/40"
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="space-y-2 py-6">
                                            {!auth.user && (
                                                <Link
                                                    href={login().url}
                                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold hover:bg-secondary/40"
                                                >
                                                    Log in
                                                </Link>
                                            )}
                                            <Link
                                                href={primaryCta.href}
                                                className="mt-2 block rounded-md bg-[#0042FF] px-4 py-3 text-center text-base font-semibold text-white hover:bg-[#0042FF]/90"
                                            >
                                                {auth.user
                                                    ? 'Dashboard'
                                                    : 'Get started'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </header>

                    {/* ── Hero ── */}
                    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-12 pb-20 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:pt-24 lg:pb-28">
                        <div>
                            <p className="text-sm font-semibold text-primary">
                                The NUST computer science community
                            </p>
                            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                                Build. Share.
                                <br />
                                <span className="text-primary">
                                    Grow together.
                                </span>
                            </h1>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-pretty text-muted-foreground">
                                DEV-CRAFT is the home for CS students to find
                                study materials, join hackathons and share what
                                they build, all in one moderated, structured
                                space.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link
                                    href={primaryCta.href}
                                    className="group inline-flex items-center justify-center gap-2 rounded-md bg-[#0042FF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0042FF]/90"
                                >
                                    {primaryCta.label}
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                                <Link
                                    href="/resources"
                                    className="inline-flex items-center justify-center rounded-md border border-border bg-card/60 px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-card"
                                >
                                    Browse resources
                                </Link>
                            </div>
                        </div>

                        {/* Preview panel */}
                        <div
                            aria-hidden="true"
                            className="rounded-xl border border-border bg-card/80 shadow-2xl shadow-black/20 backdrop-blur"
                        >
                            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                                <span className="size-2.5 rounded-full bg-[#f85149]/80" />
                                <span className="size-2.5 rounded-full bg-brutal-yellow/80" />
                                <span className="size-2.5 rounded-full bg-[#39ff14]/70" />
                                <span className="ml-3 text-xs font-medium text-muted-foreground">
                                    DEV-CRAFT
                                </span>
                            </div>
                            <div className="space-y-5 p-5 text-sm">
                                <p className="font-semibold">
                                    Explore the community
                                </p>
                                <ul className="space-y-3">
                                    {exploreItems.map((item) => (
                                        <li
                                            key={item.title}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-chart-1" />
                                            <div>
                                                <p className="font-medium">
                                                    {item.title}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {item.note}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="rounded-lg border border-border bg-background/60 p-4">
                                    <p className="font-medium">
                                        Request a resource:{' '}
                                        <span className="text-primary">
                                            "CS-301 past paper"
                                        </span>
                                    </p>
                                    <p className="mt-1 text-muted-foreground">
                                        Request posted. The community is on it.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <main className="relative z-10">
                    {/* ── How it works ── */}
                    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
                        <HowItWorksDeck />
                    </section>

                    {/* ── Closing CTA ── */}
                    <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
                        <div className="relative px-6 py-14 text-center sm:px-12">
                            <h2 className="relative text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                                Ready to join your CS community?
                            </h2>
                            <p className="relative mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                                Free for students. Bring your notes, your
                                projects and your questions.
                            </p>
                            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    href={primaryCta.href}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0042FF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0042FF]/90"
                                >
                                    {primaryCta.label}
                                    <ArrowRight className="size-4" />
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={login().url}
                                        className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40"
                                    >
                                        I already have an account
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                {/* ── Footer ── */}
                <footer className="relative z-10 border-t border-border">
                    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                        <div className="flex items-center gap-3">
                            <img
                                src="/newIcons/navbarIcon.png"
                                alt=""
                                className="size-6 object-contain"
                            />
                            <span className="text-xs text-muted-foreground">
                                © {new Date().getFullYear()} DEV-CRAFT · Built
                                by CS students, for CS students
                            </span>
                        </div>
                        <nav
                            aria-label="Footer"
                            className="flex flex-wrap gap-x-6 gap-y-2"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/privacy"
                                className="text-xs text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-xs text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                            >
                                Terms of Service
                            </Link>
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    );
}
