import { Link } from '@inertiajs/react';
import { KeyRound, Monitor, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: User,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: KeyRound,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: Monitor,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6">
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-52">
                    <nav
                        className="flex flex-col space-y-0.5"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const active = isCurrentUrl(item.href);
                            return (
                                <Link
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors w-full',
                                        active
                                            ? 'bg-secondary/40 text-foreground'
                                            : 'text-muted-foreground hover:bg-secondary/30 hover:text-foreground',
                                    )}
                                >
                                    {item.icon && (
                                        <item.icon className={cn('size-3.5 shrink-0', active ? 'text-primary' : 'text-muted-foreground/70')} />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
