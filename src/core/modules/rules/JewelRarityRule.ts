import { FrameType, RuleId, RuleMode, RuleViolation } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class JewelRarityRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.JewelRarity, mode, list);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];

        for (const item of character.passiveItems) {
            if ([0, 1, 2, 3].includes(item.frameType)) {
                const violation: RuleViolation = {
                    rule: this.id,
                    id: item.id,
                    text: FrameType[item.frameType],
                    display: `${item.name} ${item.typeLine}`,
                };

                violations.push(violation);
            }
        }

        return violations;
    }
}
