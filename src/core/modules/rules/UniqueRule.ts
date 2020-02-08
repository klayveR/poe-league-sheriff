import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getItemName } from "@/core/utility/getItemName";

export class UniqueRule extends Rule {
    constructor(enabled = false, mode: RuleMode = RuleMode.Blacklist, list: string[] = []) {
        super(enabled, RuleId.Unique, mode, list);
    }

    public getMatches(character: Character): RuleMatch[] {
        let items = [...character.items, ...character.passiveItems];
        items = items.filter((item) => item.frameType === 3);

        const matches: RuleMatch[] = [];
        for (const item of items) {
            const name = getItemName(item.name, item.typeLine);
            const match: RuleMatch = {
                rule: this.id,
                id: item.id,
                compare: name,
                display: name,
                isViolation: false,
            };

            matches.push(match);
        }

        return matches;
    }
}
