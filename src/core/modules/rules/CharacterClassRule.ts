import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character, Rule } from "@/core/modules";

export class CharacterClassRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Class, mode, list);
    }

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
