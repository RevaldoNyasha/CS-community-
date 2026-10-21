// Each tag gets a stable colour from its name, for the sidebar dots and the card chips.
const COLORS = [
    {
        dot: 'bg-violet-400',
        chip: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    },
    {
        dot: 'bg-blue-400',
        chip: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    },
    {
        dot: 'bg-emerald-400',
        chip: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    },
    {
        dot: 'bg-orange-400',
        chip: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
    },
    {
        dot: 'bg-pink-400',
        chip: 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
    },
    { dot: 'bg-red-400', chip: 'bg-red-500/15 text-red-700 dark:text-red-300' },
    {
        dot: 'bg-cyan-400',
        chip: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
    },
    {
        dot: 'bg-yellow-400',
        chip: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300',
    },
    {
        dot: 'bg-indigo-400',
        chip: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
    },
];

export function tagColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);

    return COLORS[Math.abs(hash) % COLORS.length];
}
