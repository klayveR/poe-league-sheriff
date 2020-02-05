import { RuleId, RuleMode, RuleViolation, FrameType } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class FlaskRarityRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.FlaskRarity, mode, list);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];
        let items = [...character.items, ...character.passiveItems];

        items = items.filter(
            (item) => [0, 1, 3].includes(item.frameType) && item.typeLine.includes("Flask")
        );

        for (const item of items) {
            const violation: RuleViolation = {
                rule: this.id,
                id: item.id,
                text: FrameType[item.frameType],
                display: `${item.name} ${item.typeLine}`,
            };

            violations.push(violation);
        }

        return violations;
    }
}
