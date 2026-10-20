import { useState } from 'react';
import { cn } from '@/lib/utils';

// Only stream the video on larger screens for visitors who allow motion and are not saving data;
// everyone else gets the 9 KB poster frame.
function shouldPlayVideo() {
    if (typeof window === 'undefined') return false;
    const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    return (
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        window.matchMedia('(min-width: 768px)').matches &&
        !connection?.saveData
    );
}

// Looping brand video behind a heavy overlay that keeps text readable over its bright scenes.
// The parent must be positioned (relative/isolate); `overlayClassName` tunes the overlay.
export default function BrandVideoBackground({
    overlayClassName = 'bg-linear-to-r from-background/95 via-background/85 to-background/70',
    fadeBottom = true,
}: {
    overlayClassName?: string;
    fadeBottom?: boolean;
}) {
    const [playVideo] = useState(shouldPlayVideo);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
            <img
                src="/videos/welcome-bg-poster.jpg"
                alt=""
                className="absolute inset-0 size-full object-cover"
            />
            {playVideo && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/videos/welcome-bg-poster.jpg"
                    className="absolute inset-0 size-full object-cover"
                >
                    <source src="/videos/welcome-bg.webm" type="video/webm" />
                    <source src="/videos/welcome-bg.mp4" type="video/mp4" />
                </video>
            )}
            <div className={cn('absolute inset-0', overlayClassName)} />
            {fadeBottom && (
                <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
            )}
        </div>
    );
}
