import { RuleId, RuleMode, RuleViolation } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class ItemInfluenceRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Influence, mode, list);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];
        const items = [...character.items, ...character.passiveItems];

        for (const item of items) {
            if (item.influences) {
                Object.entries(item.influences).forEach(([type, value]) => {
                    if (value) {
                        const violation: RuleViolation = {
                            rule: this.id,
                            id: item.id,
                            text: type,
                            display: `${item.name} ${item.typeLine} (${type[0].toUpperCase() +
                                type.slice(1)})`,
                        };

                        violations.push(violation);
                    }
                });
            }
        }

        return violations;
    }
}
