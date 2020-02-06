import { RuleMode } from "@/core/models";

export interface ConfigSchema {
    name: string;
    rules: {
        [key: string]: {
            enabled: boolean;
            mode: RuleMode;
            display: string;
            list: string[];
        };
    };
}
