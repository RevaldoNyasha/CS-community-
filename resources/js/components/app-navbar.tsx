import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronDown, Menu, Moon, Search, Sun, X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { AppSidebarContent, SidebarLogo } from '@/components/app-sidebar';
import { InitialsAvatar } from '@/components/initials-avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { UserMenuContent } from '@/components/user-menu-content';
import { useAppearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import { timeAgo } from '@/lib/time-ago';
import { cn } from '@/lib/utils';
import { login, register } from '@/routes';
import type { ConversationSummary, SharedData } from '@/types';

const iconButton =
    'relative flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground';

// Listing pages search themselves; elsewhere, search goes to the dashboard (or resources for guests).
const searchablePages = [
    '/resources',
    '/projects',
    '/hackathons',
    '/dashboard',
];

// Rendered with `key={current}`, so it starts over with the URL's term whenever another control
// changes the search (e.g. "Clear filters").
function GlobalSearch({ path, current }: { path: string; current: string }) {
    const { auth } = usePage<SharedData>().props;
    const [value, setValue] = useState(current);

    const target = searchablePages.includes(path)
        ? path
        : auth.user
          ? '/dashboard'
          : '/resources';

    const go = (search: string) => router.get(target, search ? { search } : {});

    const submit = (event: FormEvent) => {
        event.preventDefault();
        go(value.trim());
    };

    return (
        <form
            role="search"
            onSubmit={submit}
            className="relative w-full max-w-[370px]"
        >
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[17px] -translate-y-1/2 text-muted-foreground" />
            <input
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search posts, tags, or topics..."
                aria-label="Search posts, tags, or topics"
                className="h-10 w-full rounded-full border border-border bg-card pr-9 pl-10 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/25 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => {
                        setValue('');
                        if (current) go('');
                    }}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <X className="size-3.5" />
                </button>
            )}
        </form>
    );
}

function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const dark = resolvedAppearance === 'dark';
    const label = dark ? 'Switch to light theme' : 'Switch to dark theme';

    return (
        <button
            type="button"
            onClick={() => updateAppearance(dark ? 'light' : 'dark')}
            className={iconButton}
            title={label}
        >
            <span className="sr-only">{label}</span>
            {dark ? (
                <Sun className="size-5" strokeWidth={1.75} />
            ) : (
                <Moon className="size-5" strokeWidth={1.75} />
            )}
        </button>
    );
}

// The bell lists recent chats; the red dot means some have unread messages.
function NotificationsMenu() {
    const unread = usePage<SharedData>().props.unreadMessages ?? 0;
    // null while loading; fetched each time the menu opens so it is always fresh
    const [conversations, setConversations] = useState<
        ConversationSummary[] | null
    >(null);
    const [failed, setFailed] = useState(false);

    const load = (open: boolean) => {
        if (!open) return;
        setFailed(false);
        fetch('/messages/preview', {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        })
            .then((response) => {
                if (!response.ok) throw new Error(String(response.status));

                return response.json();
            })
            .then((data: { conversations: ConversationSummary[] }) =>
                setConversations(data.conversations),
            )
            .catch(() => setFailed(true));
    };

    return (
        <DropdownMenu onOpenChange={load}>
            <DropdownMenuTrigger asChild>
                <button type="button" className={iconButton}>
                    <span className="sr-only">
                        Notifications
                        {unread > 0 ? ` (${unread} unread chats)` : ''}
                    </span>
                    <Bell className="size-5" strokeWidth={1.75} />
                    {unread > 0 && (
                        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
                <div className="flex items-center justify-between px-2 pt-1 pb-2">
                    <p className="text-base font-semibold">Messages</p>
                    <Link
                        href="/messages"
                        className="text-sm font-medium text-primary hover:text-primary/80"
                    >
                        See all
                    </Link>
                </div>
                {failed ? (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                        Couldn't load your chats.
                    </p>
                ) : conversations === null ? (
                    <div className="flex justify-center py-6">
                        <Spinner />
                    </div>
                ) : conversations.length === 0 ? (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                        No messages yet. Use the message button on a post to
                        start a chat.
                    </p>
                ) : (
                    conversations.map((c) => (
                        <DropdownMenuItem
                            key={c.id}
                            asChild
                            className="cursor-pointer rounded-lg p-2"
                        >
                            <Link href={`/messages?c=${c.id}`}>
                                <InitialsAvatar
                                    name={c.with.name}
                                    className="size-11"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {c.with.name}
                                    </p>
                                    <p
                                        className={cn(
                                            'truncate text-xs',
                                            c.unread
                                                ? 'font-semibold text-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {c.status === 'incoming'
                                            ? 'Message request · '
                                            : c.lastMessage?.fromMe
                                              ? 'You: '
                                              : ''}
                                        {c.lastMessage?.body} ·{' '}
                                        {timeAgo(c.updatedAt)}
                                    </p>
                                </div>
                                {c.unread && (
                                    <span className="size-2.5 shrink-0 rounded-full bg-primary" />
                                )}
                            </Link>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Top bar: the phone menu button, the search box, then the theme toggle, notifications and the
// account menu. `sidebarSection` is passed on to the phone menu.
export function AppNavbar({ sidebarSection }: { sidebarSection?: ReactNode }) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const { url } = usePage();
    const [path, query = ''] = url.split('?');
    const currentSearch = new URLSearchParams(query).get('search') ?? '';

    return (
        <header className="sticky top-0 z-40 border-b border-sidebar-border bg-background/90 backdrop-blur-md">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
                {/* On desktop the sidebar has the navigation; on phones it opens from here */}
                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            className={cn(iconButton, 'shrink-0 lg:hidden')}
                        >
                            <span className="sr-only">Open menu</span>
                            <Menu className="size-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="w-72 gap-0 overflow-y-auto bg-sidebar p-0"
                    >
                        <SheetTitle className="sr-only">Menu</SheetTitle>
                        <SidebarLogo />
                        <AppSidebarContent section={sidebarSection} />
                    </SheetContent>
                </Sheet>

                <div className="min-w-0 flex-1">
                    <GlobalSearch
                        key={currentSearch}
                        path={path}
                        current={currentSearch}
                    />
                </div>

                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    <ThemeToggle />
                    {auth.user ? (
                        <>
                            <NotificationsMenu />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="group ml-1 flex items-center gap-1.5 rounded-full"
                                        data-test="user-menu-button"
                                    >
                                        <span className="sr-only">Account</span>
                                        <span className="relative">
                                            {auth.user.avatar ? (
                                                <img
                                                    src={auth.user.avatar}
                                                    alt=""
                                                    className="size-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                                    {getInitials(
                                                        auth.user.name,
                                                    )}
                                                </span>
                                            )}
                                            <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                                        </span>
                                        <ChevronDown className="hidden size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="min-w-56"
                                    align="end"
                                >
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="px-2 text-sm font-semibold whitespace-nowrap transition-colors hover:text-muted-foreground"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
