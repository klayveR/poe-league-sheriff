import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";

export class CharacterClassRule extends Rule {
    constructor(enabled = false, mode: RuleMode = RuleMode.Blacklist, list: string[] = []) {
        super(enabled, RuleId.Class, mode, list);
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
