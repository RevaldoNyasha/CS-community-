import { Head, Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

const navigation = [
  { name: 'Resources', href: '/resources' },
  { name: 'Hackathons', href: '/hackathons' },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Welcome - DEV-CRAFT">
                <style>{`
                    html, body {
                        margin: 0;
                        padding: 0;
                        height: 100vh;
                        overflow: hidden;
                    }
                    #app {
                        height: 100vh;
                        overflow: hidden;
                    }
                    @media (max-width: 640px) {
                        html, body, #app {
                            overflow: auto;
                        }
                    }
                `}</style>
            </Head>
            <div className="min-h-screen bg-[#008080] flex flex-col text-black">
                {/* Nav */}
                <nav className="p-3 sm:p-5 flex justify-between items-center w-full max-w-7xl mx-auto">
                    {/* Desktop nav links */}
                    <div className="hidden sm:flex space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-base tracking-wide hover:underline focus:outline-dotted uppercase text-white hover:text-gray-200 cursor-pointer relative z-10"
                                style={{ fontFamily: "'VT323', monospace" }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden mc-btn !p-1.5"
                    >
                        {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>

                    <div>
                        {auth.user ? (
                            <Link href={dashboard().url} className="mc-btn text-xs sm:text-sm px-3 sm:px-4 uppercase">
                                Dashboard &rarr;
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-3 sm:space-x-6">
                                <Link href={login().url} className="text-xs sm:text-sm tracking-wide text-white hover:text-gray-200 hover:underline uppercase cursor-pointer relative z-10" style={{ fontFamily: "'VT323', monospace" }}>
                                    Log in &rarr;
                                </Link>
                                {canRegister && (
                                    <Link href={register().url} className="text-xs sm:text-sm tracking-wide text-white hover:text-gray-200 hover:underline uppercase cursor-pointer relative z-10" style={{ fontFamily: "'VT323', monospace" }}>
                                        Register &rarr;
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-[#c0c0c0] win95-outset mx-3 mb-2 p-2 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-1.5 text-sm uppercase font-bold hover:bg-[#000080] hover:text-white"
                                style={{ fontFamily: "'VT323', monospace" }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Main */}
                <main className="flex-grow flex flex-col items-center justify-center px-4 -mt-4 sm:-mt-10">
                    {/* Recessed welcome box */}
                    <div
                        className="mb-6 sm:mb-10 text-center px-4 sm:px-6 py-2 sm:py-3 mx-2"
                        style={{
                            borderTop: '2px solid #004040',
                            borderLeft: '2px solid #004040',
                            borderRight: '2px solid #c0c0c0',
                            borderBottom: '2px solid #c0c0c0',
                        }}
                    >
                        <p className="text-sm sm:text-lg tracking-wide text-black" style={{ fontFamily: "'VT323', monospace" }}>
                            Welcome to DEV-CRAFT Community Platform.{' '}
                            <Link href={auth.user ? dashboard().url : login().url} className="opacity-70 hover:opacity-100">
                                Get started &rarr;
                            </Link>
                        </p>
                    </div>

                    {/* Heading */}
                    <div className="max-w-2xl text-center mb-6 sm:mb-10 px-2">
                        <h1
                            className="text-lg sm:text-2xl md:text-3xl leading-tight tracking-wide text-black uppercase font-bold"
                            style={{ fontFamily: "'VT323', monospace" }}
                        >
                            Discover world-class resources, connect with fellow developers, and advance your coding journey at DEV-CRAFT.
                        </h1>
                    </div>

                    {/* CTA button with shadow */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-black translate-x-1 translate-y-1" />
                        {auth.user ? (
                            <Link
                                href={dashboard().url}
                                className="mc-btn text-base sm:text-xl px-5 sm:px-8 py-2 relative z-10 active:translate-x-0.5 active:translate-y-0.5 inline-block uppercase"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={register().url}
                                className="mc-btn text-base sm:text-xl px-5 sm:px-8 py-2 relative z-10 active:translate-x-0.5 active:translate-y-0.5 inline-block uppercase"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </main>

                {/* Win95 Taskbar Footer */}
                <footer className="p-1.5 border-t border-[#808080] bg-[#c0c0c0] flex items-center">
                    <div
                        className="py-0.5 px-2 sm:px-3 text-[10px] sm:text-xs w-16 sm:w-40"
                        style={{
                            borderTop: '2px solid #004040',
                            borderLeft: '2px solid #004040',
                            borderRight: '2px solid #c0c0c0',
                            borderBottom: '2px solid #c0c0c0',
                        }}
                    >
                        READY
                    </div>
                    <div
                        className="py-0.5 px-2 sm:px-3 text-[10px] sm:text-xs flex-grow ml-1"
                        style={{
                            borderTop: '2px solid #004040',
                            borderLeft: '2px solid #004040',
                            borderRight: '2px solid #c0c0c0',
                            borderBottom: '2px solid #c0c0c0',
                        }}
                    >
                        <span className="hidden sm:inline">DEV-CRAFT v1.0.0</span>
                        <span className="sm:hidden">DEV-CRAFT</span>
                    </div>
                    <div
                        className="py-0.5 px-2 sm:px-3 text-[10px] sm:text-xs ml-1 w-16 sm:w-28 text-right"
                        style={{
                            borderTop: '2px solid #004040',
                            borderLeft: '2px solid #004040',
                            borderRight: '2px solid #c0c0c0',
                            borderBottom: '2px solid #c0c0c0',
                        }}
                    >
                        {time}
                    </div>
                </footer>
            </div>
        </>
    );
}
