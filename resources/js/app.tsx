import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = 'DEV-CRAFT';

createInertiaApp({
    // Tabs show just the page name; pages without one fall back to the brand.
    title: (title) => title || appName,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );

        // Remove the instant loading splash once the app has committed its first frame.
        requestAnimationFrame(() => {
            const splash = document.getElementById('app-splash');
            if (splash) {
                splash.classList.add('is-hidden');
                setTimeout(() => splash.remove(), 300);
            }
        });
    },
    progress: {
        color: '#0042FF',
        showSpinner: false,
    },
});

// This will set light / dark mode on load...
initializeTheme();
