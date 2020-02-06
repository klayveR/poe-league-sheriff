import { RuleId, RuleMatch, RuleMode, SocketedItemsEntity } from "@/core/models";
import { Character, Rule } from "@/core/modules";

export class GemRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Gem, mode, list);
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
