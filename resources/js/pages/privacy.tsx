import { Head, Link } from '@inertiajs/react';

export default function Privacy() {
    return (
        <>
            <Head title="Privacy Policy — DEV-CRAFT" />

            <div className="bg-background min-h-screen">
                <header className="border-b border-border px-6 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/newIcons/navbarIcon.png" alt="DEV-CRAFT" className="size-8 object-contain" />
                        <span className="text-sm font-semibold text-foreground tracking-widest uppercase">DEV-CRAFT</span>
                    </Link>
                </header>

                <main className="mx-auto max-w-3xl px-6 py-16">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">
                        <section>
                            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                            <p className="text-muted-foreground">When you sign in with Google or GitHub, we collect your name and email address. We also collect content you post on the platform such as posts, comments, and suggestions.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground">We use your information solely to provide the CS Community platform — to identify your account, display your name on content you create, and enable community features.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
                            <p className="text-muted-foreground">We do not sell or share your personal data with third parties. Your information is stored securely and only used within this platform.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">4. File Storage</h2>
                            <p className="text-muted-foreground">Files uploaded to the platform are stored using Google Cloud Storage (Firebase). We do not access or share your uploaded files beyond what is necessary to display them on the platform.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">5. Account Deletion</h2>
                            <p className="text-muted-foreground">You may delete your account at any time from your profile settings. This will permanently remove your data from our platform.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
                            <p className="text-muted-foreground">If you have any questions about this privacy policy, contact us at <a href="mailto:nyasharevaldo@gmail.com" className="text-primary underline">nyasharevaldo@gmail.com</a>.</p>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
