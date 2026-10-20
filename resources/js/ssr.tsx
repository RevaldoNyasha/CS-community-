import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName = 'DEV-CRAFT';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) =>
            title && title !== appName ? `${title} · ${appName}` : appName,
        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            return <App {...props} />;
        },
    }),
);
