import { RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character } from "@/core/modules";

export abstract class Rule {
    public id: RuleId;
    public mode: RuleMode;
    public overrides: RuleId[];
    public list: string[];

    constructor(
        id: RuleId,
        mode: RuleMode = RuleMode.Whitelist,
        list: string[] = [],
        overrides: RuleId[] = []
    ) {
        this.id = id;
        this.mode = mode;
        this.list = list;
        this.overrides = overrides;
    }

    public getRuleMatchs(character: Character): RuleMatch[] {
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
