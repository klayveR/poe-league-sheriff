import { RuleId, RuleMatch } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getItemName } from "@/core/utility";

export class UniqueRule extends Rule {
    public id = RuleId.Unique;

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
