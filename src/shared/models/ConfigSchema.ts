import { RuleMode } from "@/core/models";

export interface ConfigSchema {
    name: string;
    threshold: {
        gemLevel: number;
        characterLevel: number;
    };
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
