import type { CSSProperties } from 'react';

export const BRAND_BLUE = '#0042FF';

// Put on a page's root element to swap the theme's primary for the brand blue on everything
// inside. Utilities read --color-*, which resolve at :root, so those are overridden directly.
export const brandStyle = {
    '--color-primary': BRAND_BLUE,
    '--color-primary-foreground': '#ffffff',
    '--color-ring': BRAND_BLUE,
} as CSSProperties;
