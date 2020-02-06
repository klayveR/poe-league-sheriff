import { RuleViolation } from "./RuleViolation";

export interface RuleMatch extends RuleViolation {
    compare: string;
    isViolation: boolean;
}
