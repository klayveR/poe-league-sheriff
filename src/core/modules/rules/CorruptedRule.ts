import { RuleId, RuleMatch, SocketedItemsEntity } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getItemName, getGemLevel } from "@/core/utility";

export class CorruptedRule extends Rule {
    public id = RuleId.Corrupted;

    public getMatches(character: Character): RuleMatch[] {
        let gems: SocketedItemsEntity[] = [];

        for (const item of character.items) {
            if (item.socketedItems) {
                gems.push(...item.socketedItems);
            }
        }

        gems = gems.filter((gem) => gem.frameType === 4);

        const matches: RuleMatch[] = [];

        // Check equippable items
        for (const item of character.items) {
            if (!item.corrupted) {
                continue;
            }

            const match: RuleMatch = {
                rule: this.id,
                id: item.id,
                compare: "Corrupted",
                display: `${getItemName(item.name, item.typeLine)}`,
                isViolation: false,
            };

            matches.push(match);
        }

        // Check gems
        for (const gem of gems) {
            if (!gem.corrupted) {
                continue;
            }

            const gemLevel = getGemLevel(gem);
            const match: RuleMatch = {
                rule: this.id,
                id: gem.id,
                compare: "Corrupted",
                display: `${gem.typeLine}${gemLevel != null ? ` (${gemLevel})` : ``}`,
                isViolation: false,
            };

            matches.push(match);
        }

        return matches;
    }
}
