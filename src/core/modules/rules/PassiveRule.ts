import { RuleId, RuleMode, RuleViolation } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class PassiveRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Passive, mode, list);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];

        for (const hash of character.passiveHashes) {
            const violation: RuleViolation = {
                rule: this.id,
                id: hash.toString(),
                text: hash.toString(),
                display: `Allocated ${hash.toString()}`,
            };

            violations.push(violation);
        }

        return violations;
    }
}
