import { RuleId, RuleMatch, SocketedItemsEntity } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getGemLevel } from "@/core/utility";

export class GemRule extends Rule {
    public id = RuleId.Gem;

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
            const gemLevel = getGemLevel(gem);
            if (gemLevel && gemLevel < this.threshold) {
                continue;
            }

            const match: RuleMatch = {
                rule: this.id,
                id: gem.id,
                compare: gem.typeLine,
                display: `${gem.typeLine}${gemLevel != null ? ` (${gemLevel})` : ``}`,
                isViolation: false,
            };

            matches.push(match);
        }

        return matches;
    }
}
