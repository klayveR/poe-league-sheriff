import { RuleId, RuleMatch, CompareMode } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";

export class CharacterClassRule extends Rule {
    public id = RuleId.Class;
    public compareMode = CompareMode.Exact;

    public getMatches(character: Character): RuleMatch[] {
        const matches: RuleMatch[] = [
            {
                rule: this.id,
                id: character.data.character.class,
                compare: character.data.character.class,
                display: character.data.character.class,
                isViolation: false,
            },
        ];

        return matches;
    }
}
