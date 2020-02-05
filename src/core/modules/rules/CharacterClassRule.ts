import { RuleId, RuleMode, RuleViolation } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class CharacterClassRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Class, mode, list);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [
            {
                rule: this.id,
                id: character.data.character.class,
                text: character.data.character.class,
                display: character.data.character.class,
            },
        ];

        return violations;
    }
}
