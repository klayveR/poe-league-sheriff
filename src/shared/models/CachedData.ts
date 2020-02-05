import { LadderCharacter, DatabaseViolation } from "@/core/models";

export interface CachedData {
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
