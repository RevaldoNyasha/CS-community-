import { defineConfig } from 'vitest/config';

// Local config so Vitest does NOT climb up to the project root's vite.config.ts
// (which loads Laravel/Inertia plugins unrelated to this standalone Node project).
export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js'],
    },
});
