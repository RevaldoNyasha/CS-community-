import AppLayoutTemplate from '@/layouts/app/app-topnav-layout';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({ children, ...props }: AppLayoutProps) {
    return <AppLayoutTemplate {...props}>{children}</AppLayoutTemplate>;
}
