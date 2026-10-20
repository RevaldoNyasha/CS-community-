import { useLayoutEffect } from 'react';

// Public brand pages (welcome, login, sign-up) are always dark, whatever the visitor's saved
// appearance; their own setting is restored when they navigate away.
export function useForceDarkTheme() {
    useLayoutEffect(() => {
        const root = document.documentElement;
        const wasDark = root.classList.contains('dark');
        const previousScheme = root.style.colorScheme;

        root.classList.add('dark');
        root.style.colorScheme = 'dark';

        return () => {
            root.classList.toggle('dark', wasDark);
            root.style.colorScheme = previousScheme;
        };
    }, []);
}
