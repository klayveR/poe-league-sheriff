import { RuleId } from "./RuleId";

export interface RuleViolation {
    rule: RuleId;
    id: string;
    display: string;
}
