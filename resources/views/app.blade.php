<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'dark') !== 'light'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it before paint --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "dark" }}';

                if (appearance === 'light') {
                    document.documentElement.classList.remove('dark');
                } else if (appearance === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme --}}
        {{-- and to paint an instant loading splash before the JS bundle mounts --}}
        <style>
            html {
                background-color: #c8cacd;
            }
            html.dark {
                background-color: #0d1117;
            }

            #app-splash {
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 20px;
                background-color: #c8cacd;
                transition: opacity 0.3s ease;
            }
            html.dark #app-splash {
                background-color: #0d1117;
            }
            #app-splash.is-hidden {
                opacity: 0;
                pointer-events: none;
            }
            #app-splash img {
                width: 48px;
                height: 48px;
                opacity: 0.9;
            }
            .app-splash__spinner {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid rgba(100, 116, 139, 0.25);
                border-top-color: #22d3ee;
                animation: app-splash-spin 0.7s linear infinite;
            }
            @keyframes app-splash-spin {
                to { transform: rotate(360deg); }
            }
            @media (prefers-reduced-motion: reduce) {
                .app-splash__spinner { animation-duration: 1.6s; }
            }
        </style>

        <title inertia>{{ config('app.name', 'CS') }}</title>

        <link rel="icon" href="/newIcons/navbarIcon.png" type="image/png">
        <link rel="apple-touch-icon" href="/newIcons/navbarIcon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|jetbrains-mono:400,500,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased text-[13px]">
        {{-- Instant loading splash, removed by resources/js/app.tsx once React mounts. --}}
        {{-- Must live OUTSIDE the Inertia #app root so React does not wipe it. --}}
        <div id="app-splash" aria-hidden="true">
            <img src="/newIcons/navbarIcon.png" alt="" width="48" height="48">
            <div class="app-splash__spinner"></div>
        </div>
        @inertia
    </body>
</html>
