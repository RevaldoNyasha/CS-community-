import { AppNavbar } from '@/components/app-navbar';
import { cn } from '@/lib/utils';
import type { AppLayoutProps } from '@/types';

// Facebook-style frame: top navbar, then the page content. Pages that need one (the dashboard)
// pass a `sidebar`, shown as a full-height panel on the left; below lg it opens from the
// navbar's menu button instead. Pages without one use the full width.
export default function AppTopnavLayout({
    children,
    sidebar,
    mainClassName,
}: AppLayoutProps) {
    return (
        <div className="min-h-svh bg-background text-foreground">
            <AppNavbar mobileMenu={sidebar || undefined} />

            <div className="flex">
                {sidebar && (
                    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-88 shrink-0 overflow-y-auto border-r border-border bg-card p-3 lg:block">
                        {sidebar}
                    </aside>
                )}

                <main
                    className={cn(
                        'min-w-0 flex-1 px-4 py-5 sm:px-6',
                        mainClassName,
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
