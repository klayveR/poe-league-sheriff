import { RuleId, RuleViolation } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class NoPrivateProfileRule extends Rule {
    constructor() {
        super(RuleId.NoPrivateProfile);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];

        if (character.private) {
            const violation: RuleViolation = {
                rule: this.id,
                id: character.data.account.name,
                text: character.data.account.name,
                display: "Profile or character is private",
            };

            violations.push(violation);
        }

        return violations;
    }
}
