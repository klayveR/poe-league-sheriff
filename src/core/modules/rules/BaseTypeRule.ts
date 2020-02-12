import { RuleId, RuleMatch, CompareMode } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getItemName } from "@/core/utility";

export class BaseTypeRule extends Rule {
    public id = RuleId.BaseType;
    public compareMode = CompareMode.Include;

    public getMatches(character: Character): RuleMatch[] {
        let items = [...character.items, ...character.passiveItems];
        items = items.filter((item) => [0, 1, 2, 3].includes(item.frameType));

        const matches: RuleMatch[] = [];
        for (const item of items) {
            const match: RuleMatch = {
                rule: this.id,
                id: item.id,
                compare: item.typeLine,
                display: `${getItemName(item.name, item.typeLine)}`,
                isViolation: false,
            };

            matches.push(match);
        }

        return matches;
    }
}
