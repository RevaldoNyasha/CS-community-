import { Head, Link } from '@inertiajs/react';

export default function Terms() {
    return (
        <>
            <Head title="Terms of Service — DEV-CRAFT" />

            <div className="bg-background min-h-screen">
                <header className="border-b border-border px-6 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/newIcons/navbarIcon.png" alt="DEV-CRAFT" className="size-8 object-contain" />
                        <span className="text-sm font-semibold text-foreground tracking-widest uppercase">DEV-CRAFT</span>
                    </Link>
                </header>

                <main className="mx-auto max-w-3xl px-6 py-16">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
                    <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">
                        <section>
                            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground">By accessing or using DEV-CRAFT (cs-community.space), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">2. Use of the Platform</h2>
                            <p className="text-muted-foreground">DEV-CRAFT is a community platform for computer science students to share resources, projects, and ideas. You agree to use the platform respectfully and not to post harmful, offensive, or misleading content.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">3. User Content</h2>
                            <p className="text-muted-foreground">You retain ownership of content you post. By posting, you grant DEV-CRAFT a license to display that content on the platform. You are responsible for ensuring your content does not violate any laws or third-party rights.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">4. Account Responsibility</h2>
                            <p className="text-muted-foreground">You are responsible for maintaining the security of your account. Accounts found to be abusing the platform may be suspended or removed.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
                            <p className="text-muted-foreground">We reserve the right to suspend or delete accounts that violate these terms. You may also delete your own account at any time from your settings.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
                            <p className="text-muted-foreground">We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
                            <p className="text-muted-foreground">For questions about these terms, contact us at <a href="mailto:nyasharevaldo@gmail.com" className="text-primary underline">nyasharevaldo@gmail.com</a>.</p>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
