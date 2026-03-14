import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center px-4 py-2 relative z-10 w-full overflow-hidden bg-background transition-colors">
            {/* Background elements (optional, if you want extra atmosphere) */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] border hidden dark:block bg-cyan-900/10 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>

            <div className="w-full max-w-[380px] bg-card border border-border shadow-lg dark:border-cyan-400/40 dark:bg-[#0c121d]/90 p-6 sm:p-8 rounded-[14px] dark:shadow-[0_0_20px_1px_rgba(34,211,238,0.15)] relative backdrop-blur-md transition-colors">
                {/* Logo / Brand */}
                <div className="flex justify-center mb-4">
                    <Link href={home()} className="inline-flex items-center gap-3 group">
                        <img
                            src="/newIcons/navbarIcon.png"
                            alt="DEV-CRAFT"
                            className="size-10 object-contain dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] dark:group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-all"
                        />
                        <div className="flex flex-col mt-0.5">
                            <span className="text-[15px] font-bold text-foreground dark:text-gray-100 tracking-wide leading-none mb-1 group-hover:text-primary dark:group-hover:text-cyan-50 transition-colors">DEV-CRAFT</span>
                            <span className="text-[9px] text-muted-foreground dark:text-gray-400 tracking-[0.15em] leading-none group-hover:text-primary/70 dark:group-hover:text-cyan-200/70 transition-colors">CS COMMUNITY</span>
                        </div>
                    </Link>
                </div>

                {/* Title */}
                <div className="mb-5 text-center">
                    <h1 className="text-xl font-bold text-foreground dark:text-white tracking-wide transition-colors">{title}</h1>
                </div>

                {children}
            </div>
        </div>
    );
}
