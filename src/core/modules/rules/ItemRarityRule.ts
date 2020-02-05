import { RuleId, RuleMode, RuleViolation, FrameType } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class ItemRarityRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.ItemRarity, mode, list);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];
        let items = [...character.items, ...character.passiveItems];

        items = items.filter((item) => [0, 1, 2, 3].includes(item.frameType));

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
