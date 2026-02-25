import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
    return 'items' in item;
}

const menuBtnClass =
    '!rounded-sm text-[13px] text-muted-foreground font-medium hover:!bg-muted hover:!text-foreground transition-all data-[active=true]:!bg-transparent data-[active=true]:!text-foreground data-[active=true]:font-bold group-data-[collapsible=icon]:!border-0 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center';

export function NavMain({ items = [] }: { items: (NavItem | NavGroup)[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="uppercase text-[10px] text-muted-foreground/50 tracking-widest font-medium mb-1">
                Navigation
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    isNavGroup(item) ? (
                        isCollapsed ? (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.items.some((child) => isCurrentUrl(child.href))}
                                    tooltip={{ children: item.title }}
                                    className={menuBtnClass}
                                >
                                    <Link href={item.items[0]?.href ?? '#'} prefetch>
                                        {item.icon && <item.icon className="shrink-0" />}
                                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ) : (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.items.some((child) => isCurrentUrl(child.href))}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={{ children: item.title }} className={menuBtnClass}>
                                            {item.icon && <item.icon className="shrink-0" />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((child) => (
                                                <SidebarMenuSubItem key={child.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentUrl(child.href)}
                                                        className="!rounded-none text-muted-foreground hover:!bg-secondary hover:!text-foreground data-[active=true]:bg-transparent! data-[active=true]:text-foreground! data-[active=true]:font-bold"
                                                    >
                                                        <Link href={child.href} prefetch>
                                                            <span>{child.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        )
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                                className={menuBtnClass}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="shrink-0" />}
                                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
