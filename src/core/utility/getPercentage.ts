export function getPercentage(current: number, total: number): number {
    return Math.floor((current / total) * 100);
}
