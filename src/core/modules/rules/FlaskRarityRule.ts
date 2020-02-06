import { FrameType, RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character, Rule } from "@/core/modules";
import { getItemName } from "@/core/utility/getItemName";

export class FlaskRarityRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.FlaskRarity, mode, list);
    }

    public getMatches(character: Character): RuleMatch[] {
        let items = [...character.items, ...character.passiveItems];
        items = items.filter(
            (item) => [0, 1, 3].includes(item.frameType) && item.typeLine.includes("Flask")
        );

        const matches: RuleMatch[] = [];
        for (const item of items) {
            const rarity = FrameType[item.frameType];
            const violation: RuleMatch = {
                rule: this.id,
                id: item.id,
                compare: rarity,
                display: `${getItemName(item.name, item.typeLine)} (${rarity})`.trim(),
                isViolation: false,
            };

            matches.push(violation);
        }

        return matches;
    }
}
