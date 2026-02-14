import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 bg-[#008080]">
            <div className="w-full max-w-sm">
                <div className="win95-window">
                    {/* Win95 Title Bar */}
                    <div className="win95-titlebar flex items-center justify-between px-1 py-0.5 mb-1" style={{ background: 'linear-gradient(90deg, #808080, #b0b0b0)' }}>
                        <div className="flex items-center gap-1 px-0.5">
                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                            </svg>
                            <span className="text-white text-[10px] font-bold tracking-wider uppercase">{title}</span>
                        </div>
                        <div className="flex gap-0.5 pr-0.5">
                            <Link href={home()} className="win95-raised w-4 h-4 flex items-center justify-center text-black font-bold text-[9px] bg-[#c0c0c0]">X</Link>
                        </div>
                    </div>

                    <div className="px-5 pb-6">
                        {/* Icon & Header */}
                        <div className="flex flex-col items-center mb-5">
                            <Link href={home()} className="inline-block mb-4">
                                <div className="win95-window p-1.5">
                                    <div className="win95-sunken bg-[#c0c0c0] p-2">
                                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                            <h1 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">{title}</h1>
                            <p className="text-[10px] text-gray-600">{description}</p>
                        </div>

                        {/* Form content */}
                        {children}
                    </div>

                    {/* Status Bar */}
                    <div className="win95-sunken bg-[#c0c0c0] px-2 py-0.5 mt-1 flex justify-between">
                        <span className="text-[9px] text-gray-600">System Ready</span>
                        <span className="text-[9px] text-gray-600">NUM</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
