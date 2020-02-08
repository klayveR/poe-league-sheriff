import { FrameType, RuleId, RuleMatch } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getItemName } from "@/core/utility";

export class ItemRarityRule extends Rule {
    public id = RuleId.ItemRarity;

    public getMatches(character: Character): RuleMatch[] {
        let items = [...character.items, ...character.passiveItems];
        items = items.filter((item) => [0, 1, 2, 3].includes(item.frameType));

        const matches: RuleMatch[] = [];
        for (const item of items) {
            const rarity = FrameType[item.frameType];
            const match: RuleMatch = {
                rule: this.id,
                id: item.id,
                compare: rarity,
                display: `${getItemName(item.name, item.typeLine)} (${rarity})`.trim(),
                isViolation: false,
            };

            matches.push(match);
        }

        return matches;
    }
}
