import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character } from "@/core/modules/Character";

export abstract class Rule {
    public enabled: boolean;
    public id: RuleId;
    public mode: RuleMode;
    public list: string[];

    constructor(
        enabled: boolean,
        id: RuleId,
        mode: RuleMode = RuleMode.Whitelist,
        list: string[] = []
    ) {
        this.enabled = enabled;
        this.id = id;
        this.mode = mode;
        this.list = list;
    }

    public getRuleMatches(character: Character): RuleMatch[] {
        const violations: RuleMatch[] = this.getMatches(character);

        for (const violation of violations) {
            if (this.mode === RuleMode.Whitelist && !this.list.includes(violation.compare)) {
                violation.isViolation = true;
            }

            if (this.mode === RuleMode.Blacklist && this.list.includes(violation.compare)) {
                violation.isViolation = true;
            }
        }

        return violations;
    }

    public abstract getMatches(character: Character): RuleMatch[];
}
