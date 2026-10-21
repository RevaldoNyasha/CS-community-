import { AppNavbar } from '@/components/app-navbar';
import { AppSidebarContent, SidebarLogo } from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import type { AppLayoutProps } from '@/types';

// App frame: a fixed sidebar on the left (logo, sections, tags), and on the right the top bar
// above the page. Below lg the sidebar opens from the top bar's menu button instead.
// A page's own `sidebar` (e.g. the chat list) sits between the app sidebar and the content.
export default function AppTopnavLayout({
    children,
    sidebar,
    sidebarSection,
    mainClassName,
}: AppLayoutProps) {
    return (
        <div className="min-h-svh bg-background text-foreground">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar lg:flex">
                <SidebarLogo />
                <div className="pt-2">
                    <AppSidebarContent section={sidebarSection} />
                </div>
            </aside>

            <div className="lg:pl-60">
                <AppNavbar sidebarSection={sidebarSection} />

                <div className="flex">
                    {sidebar && (
                        <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-80 shrink-0 overflow-y-auto border-r border-border bg-card p-3 lg:block">
                            {sidebar}
                        </aside>
                    )}

                    <main
                        className={cn(
                            'min-w-0 flex-1 px-4 py-6 sm:px-6',
                            mainClassName,
                        )}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
