/** 2500 → "2.5K", 1200000 → "1.2M". */
export function formatCount(value: number) {
    return new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}
