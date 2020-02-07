import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";

export class PassiveRule extends Rule {
    constructor(enabled = false, mode: RuleMode = RuleMode.Blacklist, list: string[] = []) {
        super(enabled, RuleId.Passive, mode, list);
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
