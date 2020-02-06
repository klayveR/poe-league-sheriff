import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character, Rule } from "@/core/modules";

export class PassiveRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Passive, mode, list);
    }

    public getMatches(character: Character): RuleMatch[] {
        const matches: RuleMatch[] = [];

        for (const hash of character.passiveHashes) {
            const violation: RuleMatch = {
                rule: this.id,
                id: hash.toString(),
                compare: hash.toString(),
                display: `Allocated ${hash.toString()}`,
                isViolation: false,
            };

            matches.push(violation);
        }

        return matches;
    }
}
