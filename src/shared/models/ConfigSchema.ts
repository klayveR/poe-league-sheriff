import { RuleMode } from "@/core/models";

export interface ConfigSchema {
    name: string;
    rules: {
        [key: string]: ConfigRule;
    };
}

export interface ConfigRule {
    enabled: boolean;
    mode: RuleMode;
    display: string;
    list: string[];
}
