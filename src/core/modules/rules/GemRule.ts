import { RuleId, RuleMatch, RuleMode, SocketedItemsEntity } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";

export class GemRule extends Rule {
    constructor(enabled = false, mode: RuleMode = RuleMode.Blacklist, list: string[] = []) {
        super(enabled, RuleId.Gem, mode, list);
    }

    public getMatches(character: Character): RuleMatch[] {
        const gems: SocketedItemsEntity[] = [];

        for (const item of character.items) {
            if (item.socketedItems) {
                gems.push(...item.socketedItems);
            }
        }

        const matches: RuleMatch[] = [];
        for (const gem of gems) {
            if (gem.frameType === 4) {
                const violation: RuleMatch = {
                    rule: this.id,
                    id: gem.id,
                    compare: gem.typeLine,
                    display: gem.typeLine,
                    isViolation: false,
                };

                matches.push(violation);
            }
        }

        return matches;
    }
}
