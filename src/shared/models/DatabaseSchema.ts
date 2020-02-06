import { LadderCharacter, RuleViolation } from "@/core/models";

export interface DatabaseSchema {
    ladder: LadderCharacter[];
    violations: DatabaseViolation[];
}

export interface DatabaseViolation extends RuleViolation {
    characterId: string;
    occured: DatabaseViolationData;
    resolved: DatabaseViolationData | null;
}

export interface DatabaseViolationData {
    time: string;
    level: number;
    experience: number;
}
