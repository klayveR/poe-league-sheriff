import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character, Rule } from "@/core/modules";
import { getItemName } from "@/core/utility/getItemName";

export class UniqueRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Unique, mode, list);
    }

    public getMatches(character: Character): RuleMatch[] {
        let items = [...character.items, ...character.passiveItems];
        items = items.filter((item) => item.frameType === 3);

        const matches: RuleMatch[] = [];
        for (const item of items) {
            const name = getItemName(item.name, item.typeLine);
            const violation: RuleMatch = {
                rule: this.id,
                id: item.id,
                compare: name,
                display: name,
                isViolation: false,
            };

            matches.push(violation);
        }

        return matches;
    }
}
