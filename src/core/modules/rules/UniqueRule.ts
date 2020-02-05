import { RuleId, RuleMode, RuleViolation } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class UniqueRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Unique, mode, list);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];
        let items = [...character.items, ...character.passiveItems];

        items = items.filter((item) => item.frameType === 3);

        for (const item of items) {
            const violation: RuleViolation = {
                rule: this.id,
                id: item.id,
                text: item.name,
                display: `${item.name} ${item.typeLine}`,
            };

            violations.push(violation);
        }

        return violations;
    }
}
