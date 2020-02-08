import { FrameType, RuleId, RuleMatch } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getItemName } from "@/core/utility";

export class JewelRarityRule extends Rule {
    public id = RuleId.JewelRarity;

    public getMatches(character: Character): RuleMatch[] {
        let items = character.passiveItems;
        items = items.filter((item) => !item.abyssJewel);

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
