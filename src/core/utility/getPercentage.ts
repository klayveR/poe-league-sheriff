export function getPercentage(current: number, total: number, noDecimals = true): number {
    const percentage = (current / total) * 100;

    if (noDecimals) {
        return Math.floor(percentage);
    } else {
        return +percentage.toFixed(2);
    }
}
