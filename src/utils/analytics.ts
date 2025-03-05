export function formatNumber(num: number): string {
    // Define suffixes for different number ranges
    const suffixes: string[] = ['', 'K', 'M', 'B', 'T', 'Q'];

    // Handle zero, null, or undefined
    if (num === 0 || num == null) return '0';

    // Handle negative numbers
    const isNegative: boolean = num < 0;
    const absNum: number = Math.abs(num);

    // Determine the appropriate suffix and scale the number
    const tier: number = Math.floor(Math.log10(absNum) / 3);
    const suffixIndex: number = Math.min(tier, suffixes.length - 1);
    const suffix: string = suffixes[suffixIndex];

    // Scale the number
    const scaled: number = absNum / Math.pow(1000, suffixIndex);

    // Format the number based on whether it is a whole number or not
    let formatted: string;
    if (scaled % 1 === 0) {
        formatted = scaled.toString();
    } else if (scaled < 10) {
        formatted = scaled.toFixed(1).replace(/\.0$/, '');
    } else {
        formatted = Math.round(scaled).toString();
    }

    // Add the negative sign back if necessary
    return (isNegative ? '-' : '') + formatted + suffix;
}
