import { LadderCharacter } from "@/core/models";

import { DatabaseViolation } from "../../shared/models/DatabaseSchema";

export interface CacheSchema {
    lastUpdate: string;
    ladder: CachedLadderCharacter[];
}

export interface CachedLadderCharacter extends LadderCharacter {
    violations: {
        entries: CacheViolation[];
        active: number;
        resolved: number;
    };
}

export interface CacheViolation extends DatabaseViolation {
    ruleDisplay: string;
}
