import { RuleId, RuleMatch } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getItemName } from "@/core/utility";

export class AffixRule extends Rule {
    public id = RuleId.Affix;

    public getMatches(character: Character): RuleMatch[] {
        const matches: RuleMatch[] = [];

        // Check equippable items
        for (const item of character.items) {
            if (!item.explicitMods) {
                continue;
            }

            const affixesString = item.explicitMods.join(", ");

            for (const explicit of item.explicitMods) {
                const pattern = /((?:[+-])?\d+(?:\.\d+)?)/g;
                const affix = explicit.replace(pattern, "#");

                const match: RuleMatch = {
                    rule: this.id,
                    id: item.id,
                    compare: affix,
                    display: `${getItemName(item.name, item.typeLine)} (${affixesString})`,
                    isViolation: false,
                };

                matches.push(match);
            }
        }

        return matches;
    }
}
