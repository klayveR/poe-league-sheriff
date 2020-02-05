import { Signale } from "signale";

const options = {
    disabled: false,
    interactive: false,
    logLevel: "info",
    secrets: [],
    stream: process.stdout,
    types: {
        database: {
            badge: "☐",
            color: "grey",
            label: "database",
            logLevel: "info",
        },
        violation: {
            badge: "⚠",
            color: "yellow",
            label: "rule",
            logLevel: "info",
        },
        resolved: {
            badge: "⚠",
            color: "green",
            label: "rule",
            logLevel: "info",
        },
    },
};

export const signale = new Signale(options);
export const interactive = new Signale({ ...options, ...{ interactive: true } });
