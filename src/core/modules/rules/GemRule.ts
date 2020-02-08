import { RuleId, RuleMatch, RuleMode, SocketedItemsEntity } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getGemLevel, isGreaterEqualThreshold } from "@/core/utility";

export class GemRule extends Rule {
    constructor(enabled = false, mode: RuleMode = RuleMode.Blacklist, list: string[] = []) {
        super(enabled, RuleId.Gem, mode, list);
    }

    public getMatches(character: Character): RuleMatch[] {
        let gems: SocketedItemsEntity[] = [];

        for (const item of character.items) {
            if (item.socketedItems) {
                gems.push(...item.socketedItems);
            }
        }

        gems = gems.filter((gem) => gem.frameType === 4);

        const matches: RuleMatch[] = [];
        for (const gem of gems) {
            if (!isGreaterEqualThreshold(getGemLevel(gem), "gemLevel")) {
                continue;
            }

            const match: RuleMatch = {
                rule: this.id,
                id: gem.id,
                compare: gem.typeLine,
                display: gem.typeLine,
                isViolation: false,
            };

            matches.push(match);
        }

        return matches;
    }
}
