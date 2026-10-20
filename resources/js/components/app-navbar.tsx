import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    House,
    Lightbulb,
    Menu,
    MessageCircle,
    Settings,
    Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { InitialsAvatar } from '@/components/initials-avatar';
import { SidebarRow } from '@/components/sidebar-row';
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
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { timeAgo } from '@/lib/time-ago';
import { cn } from '@/lib/utils';
import { dashboard, home, login, register } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { ConversationSummary, SharedData } from '@/types';

type Tab = { title: string; href: string; icon: LucideIcon };

const memberTabs: Tab[] = [
    { title: 'Dashboard', href: dashboard().url, icon: House },
    { title: 'Resources', href: '/resources', icon: BookOpen },
    { title: 'Hackathons', href: '/hackathons', icon: Trophy },
    { title: 'Projects', href: '/projects', icon: FolderGit2 },
    { title: 'Suggestions', href: '/suggestions', icon: Lightbulb },
];

const guestTabs = memberTabs.slice(1, 4);

const roundButton =
    'relative flex size-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/70 data-[state=open]:bg-primary/20 data-[state=open]:text-primary';

function Badge({ count }: { count: number }) {
    if (count <= 0) return null;

    return (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
            {count > 20 ? '20+' : count}
        </span>
    );
}

function MessagesMenu() {
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
                <button type="button" className={roundButton}>
                    <span className="sr-only">Messages</span>
                    <MessageCircle className="size-5" />
                    <Badge count={unread} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
                <div className="flex items-center justify-between px-2 pt-1 pb-2">
                    <p className="text-lg font-semibold">Chats</p>
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
                                    className="size-12"
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

function SettingsButton() {
    const { url } = usePage();
    const active = url.startsWith('/settings');

    return (
        <Link
            href={editProfile()}
            aria-current={active ? 'page' : undefined}
            className={cn(roundButton, active && 'bg-primary/20 text-primary')}
        >
            <span className="sr-only">Settings</span>
            <Settings className="size-5" />
        </Link>
    );
}

// Facebook-style top bar: logo on the left, page tabs in the centre, round action
// buttons and the account menu on the right. Below lg, `mobileMenu` opens in a slide-out sheet.
export function AppNavbar({ mobileMenu }: { mobileMenu?: ReactNode }) {
    const { auth } = usePage<SharedData>().props;
    const { isCurrentUrl } = useCurrentUrl();
    const getInitials = useInitials();
    const tabs = auth.user ? memberTabs : guestTabs;

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-card">
            <div className="flex h-14 items-center justify-between gap-2 px-3 sm:px-4">
                {/* Left */}
                <div className="flex flex-1 items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    roundButton,
                                    mobileMenu ? 'lg:hidden' : 'md:hidden',
                                )}
                            >
                                <span className="sr-only">Open menu</span>
                                <Menu className="size-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-80 overflow-y-auto p-3"
                        >
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <div className="pt-8">
                                {/* The centre tabs are hidden below md, so list them here */}
                                <div className="space-y-1 md:hidden">
                                    {tabs.map((tab) => (
                                        <SidebarRow
                                            key={tab.title}
                                            icon={tab.icon}
                                            label={tab.title}
                                            href={tab.href}
                                            active={isCurrentUrl(tab.href)}
                                        />
                                    ))}
                                </div>
                                {mobileMenu && (
                                    <>
                                        <hr className="mx-2 my-4 border-border md:hidden" />
                                        {mobileMenu}
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Link
                        href={auth.user ? dashboard() : home()}
                        className="flex shrink-0 items-center gap-2"
                    >
                        <img
                            src="/newIcons/navbarIcon.png"
                            alt=""
                            className="size-10 object-contain"
                        />
                        <span className="text-lg font-bold tracking-wide">
                            DEV-CRAFT
                        </span>
                    </Link>
                </div>

                {/* Centre tabs */}
                <nav
                    aria-label="Main"
                    className="hidden h-full items-stretch md:flex"
                >
                    {tabs.map((tab) => {
                        const active = isCurrentUrl(tab.href);

                        return (
                            <Link
                                key={tab.title}
                                href={tab.href}
                                prefetch
                                title={tab.title}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'relative flex w-20 items-center justify-center transition-colors lg:w-28',
                                    active
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex h-12 w-full items-center justify-center rounded-lg',
                                        !active && 'hover:bg-secondary/60',
                                    )}
                                >
                                    <tab.icon className="size-6" />
                                </span>
                                <span className="sr-only">{tab.title}</span>
                                {active && (
                                    <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right */}
                <div className="flex flex-1 items-center justify-end gap-2">
                    {auth.user ? (
                        <>
                            <MessagesMenu />
                            <SettingsButton />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="rounded-full transition-opacity hover:opacity-90"
                                        data-test="user-menu-button"
                                    >
                                        <span className="sr-only">Account</span>
                                        {auth.user.avatar ? (
                                            <img
                                                src={auth.user.avatar}
                                                alt=""
                                                className="size-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                                                {getInitials(auth.user.name)}
                                            </span>
                                        )}
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
                                className="px-2 text-sm font-semibold transition-colors hover:text-muted-foreground"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
