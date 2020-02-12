import { RuleId, RuleMatch, CompareMode } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";

export class NoPrivateProfileRule extends Rule {
    public id = RuleId.NoPrivateProfile;
    public compareMode = CompareMode.Exact;

    public getMatches(character: Character): RuleMatch[] {
        const matches: RuleMatch[] = [];

        if (character.private) {
            const match: RuleMatch = {
                rule: this.id,
                id: character.data.account.name,
                compare: character.data.account.name,
                display: "Profile or character is private",
                isViolation: false,
            };

            matches.push(match);
        }

        return matches;
    }
}
