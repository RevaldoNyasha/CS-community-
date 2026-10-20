import type { ReactNode } from 'react';
import type { BreadcrumbItem } from './navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    /** Left sidebar content; omit for a full-width page without one. */
    sidebar?: ReactNode;
    /** Extra classes for the main content area (e.g. to remove padding). */
    mainClassName?: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
