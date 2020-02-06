import { LadderCharacter } from "@/core/models";

import { DatabaseViolation } from "./DatabaseSchema";

export interface CacheSchema {
    ladder: CachedLadderCharacter[][];
    violations: CachedViolations;
}

export interface CachedLadderCharacter extends LadderCharacter {
    violations: {
        active: number;
        resolved: number;
    };
}

export interface CachedViolations {
    [cid: string]: DatabaseViolation[];
}
