import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, Menu, Trophy, X } from 'lucide-react';
import { useState } from 'react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

const navigation = [
    { name: 'Resources', href: '/resources' },
    { name: 'Hackathons', href: '/hackathons' },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="DEV-CRAFT — CS Community" />

            <div className="bg-background min-h-screen">
                {/* ── Nav ── */}
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                        {/* Logo */}
                        <div className="flex lg:flex-1">
                            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
                                <img src="/newIcons/navbarIcon.png" alt="DEV-CRAFT" className="size-8 object-contain" />
                                <span className="text-sm font-semibold text-foreground tracking-widest uppercase">DEV-CRAFT</span>
                            </Link>
                        </div>

                        {/* Mobile hamburger */}
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
                            >
                                <span className="sr-only">Open main menu</span>
                                <Menu className="size-6" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Desktop nav links */}
                        <div className="hidden lg:flex lg:gap-x-12">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop auth links */}
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-6">
                            {auth.user ? (
                                <Link href={dashboard().url} className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors">
                                    Dashboard <span aria-hidden="true">&rarr;</span>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login().url} className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors">
                                        Log in <span aria-hidden="true">&rarr;</span>
                                    </Link>
                                    {canRegister && (
                                        <Link href={register().url} className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors">
                                            Register <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile menu panel */}
                    {mobileMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)} />
                            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-border">
                                <div className="flex items-center justify-between">
                                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
                                        <img src="/newIcons/navbarIcon.png" alt="DEV-CRAFT" className="size-8 object-contain" />
                                        <span className="text-sm font-semibold text-foreground tracking-widest uppercase">DEV-CRAFT</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <X className="size-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="mt-6 flow-root">
                                    <div className="-my-6 divide-y divide-border">
                                        <div className="space-y-2 py-6">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-secondary/40"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="py-6 space-y-2">
                                            {auth.user ? (
                                                <Link
                                                    href={dashboard().url}
                                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-foreground hover:bg-secondary/40"
                                                >
                                                    Dashboard
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        href={login().url}
                                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-foreground hover:bg-secondary/40"
                                                    >
                                                        Log in
                                                    </Link>
                                                    {canRegister && (
                                                        <Link
                                                            href={register().url}
                                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-foreground hover:bg-secondary/40"
                                                        >
                                                            Register
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </header>

                {/* ── Hero ── */}
                <div className="relative isolate px-6 pt-14 lg:px-8">
                    {/* Top gradient blob */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    >
                        <div
                            style={{
                                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        />
                    </div>

                    <div className="mx-auto max-w-2xl py-20 sm:py-24 lg:py-28">
                        {/* Announcement pill */}
                        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm text-muted-foreground ring-1 ring-border hover:ring-primary/30">
                                The CS community for NUST students.{' '}
                                <Link
                                    href={canRegister ? register().url : login().url}
                                    className="font-semibold text-primary hover:text-primary/80"
                                >
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    Join now <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>

                        {/* Headline */}
                        <div className="text-center">
                            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl text-balance">
                                Build. Share. Grow together.
                            </h1>
                            <p className="mt-8 text-lg font-medium text-muted-foreground sm:text-xl leading-8 text-pretty">
                                DEV-CRAFT is a platform for computer science students to share resources, collaborate on hackathons, and level up their skills together.
                            </p>

                            {/* Section cards */}
                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                                <Link
                                    href="/hackathons"
                                    className="group flex flex-col gap-3 p-5 bg-card/60 border border-border rounded-xl hover:border-primary/40 hover:bg-card transition-all"
                                >
                                    <Trophy className="size-5 text-foreground" />
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Hackathons</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Discover and join upcoming hackathons in the NUST CS community.</p>
                                    </div>
                                    <span className="text-xs font-semibold text-primary group-hover:underline mt-auto">Browse →</span>
                                </Link>

                                <Link
                                    href="/projects"
                                    className="group flex flex-col gap-3 p-5 bg-card/60 border border-border rounded-xl hover:border-primary/40 hover:bg-card transition-all"
                                >
                                    <FolderGit2 className="size-5 text-foreground" />
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Projects</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Browse community-built projects and share your own work with others.</p>
                                    </div>
                                    <span className="text-xs font-semibold text-primary group-hover:underline mt-auto">Explore →</span>
                                </Link>

                                <Link
                                    href="/resources"
                                    className="group flex flex-col gap-3 p-5 bg-card/60 border border-border rounded-xl hover:border-primary/40 hover:bg-card transition-all"
                                >
                                    <BookOpen className="size-5 text-foreground" />
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Resources</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Access study materials and guides shared by fellow students.</p>
                                    </div>
                                    <span className="text-xs font-semibold text-primary group-hover:underline mt-auto">View all →</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom gradient blob */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    >
                        <div
                            style={{
                                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
