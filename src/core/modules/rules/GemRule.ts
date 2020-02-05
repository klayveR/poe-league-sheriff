import { RuleId, RuleMode, RuleViolation, SocketedItemsEntity } from "@/core/models";

import { Character } from "../Character";
import { Rule } from "../Rule";

export class GemRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Gem, mode, list);
    }

    public getPossibleViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];
        const gems: SocketedItemsEntity[] = [];

        for (const item of character.items) {
            if (item.socketedItems) {
                gems.push(...item.socketedItems);
            }
        }

        for (const gem of gems) {
            if (gem.frameType === 4) {
                const violation: RuleViolation = {
                    rule: this.id,
                    id: gem.id,
                    text: gem.typeLine,
                    display: gem.typeLine,
                };

                violations.push(violation);
            }
        }

        return violations;
    }
}
