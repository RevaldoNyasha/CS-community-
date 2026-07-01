import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'CS';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
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
        color: '#22d3ee',
        showSpinner: true,
    },
});

// This will set light / dark mode on load...
initializeTheme();
