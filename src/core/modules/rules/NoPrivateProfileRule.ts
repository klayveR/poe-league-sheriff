import { RuleId, RuleMatch } from "@/core/models";
import { Character, Rule } from "@/core/modules";

export class NoPrivateProfileRule extends Rule {
    constructor() {
        super(RuleId.NoPrivateProfile);
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
