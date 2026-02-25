import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-4 bg-background">
            <div className="w-full max-w-sm">
                {/* Logo / Brand */}
                <div className="flex justify-center mb-8">
                    <Link href={home()} className="inline-flex items-center gap-3">
                        <img src="/newIcons/navbarIcon.png" alt="DEV-CRAFT" className="size-8 object-contain" />
                        <div>
                            <p className="text-xs font-semibold text-foreground uppercase tracking-widest">DEV-CRAFT</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">CS Community</p>
                        </div>
                    </Link>
                </div>

                {/* Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>

                {children}
            </div>
        </div>
    );
}
