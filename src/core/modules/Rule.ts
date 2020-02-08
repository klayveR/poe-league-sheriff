import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character } from "@/core/modules/Character";

export abstract class Rule {
    public id?: RuleId;
    public enabled: boolean;
    public mode: RuleMode;
    public list: string[];
    public threshold: number;

    constructor(
        enabled = false,
        mode: RuleMode = RuleMode.Blacklist,
        list: string[] = [],
        threshold = 0
    ) {
        this.enabled = enabled;
        this.mode = mode;
        this.list = list;
        this.threshold = threshold;
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
