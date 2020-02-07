import { RuleId, RuleMatch } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";

export class NoPrivateProfileRule extends Rule {
    constructor(enabled = false) {
        super(enabled, RuleId.NoPrivateProfile);
    }

    public getMatches(character: Character): RuleMatch[] {
        const matches: RuleMatch[] = [];

        if (character.private) {
            const violation: RuleMatch = {
                rule: this.id,
                id: character.data.account.name,
                compare: character.data.account.name,
                display: "Profile or character is private",
                isViolation: false,
            };

            matches.push(violation);
        }

        return matches;
    }
}
