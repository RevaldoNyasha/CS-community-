import type { ReactNode } from 'react';
import type { BreadcrumbItem } from './navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    /** A page's own side panel (e.g. the chat list), shown between the app sidebar and the content. */
    sidebar?: ReactNode;
    /** Extra navigation in the app sidebar, replacing the tag list (e.g. the admin sections). */
    sidebarSection?: ReactNode;
    /** Extra classes for the main content area (e.g. to remove padding). */
    mainClassName?: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
