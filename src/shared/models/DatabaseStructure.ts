import { LadderCharacter } from "../../core/models/LeagueData";
import { RuleViolation } from "../../core/models/RuleViolation";

export interface DatabaseStructure {
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
