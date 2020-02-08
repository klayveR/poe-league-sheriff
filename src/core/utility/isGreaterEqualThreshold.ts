import config from "config";

export function isGreaterEqualThreshold(value: number | undefined, thresholdKey: string): boolean {
    if (value == null) {
        return false;
    }

    if (
        config.has(`thresholds.${thresholdKey}`) &&
        value >= config.get<number>(`thresholds.${thresholdKey}`)
    ) {
        return true;
    }

    return false;
}
