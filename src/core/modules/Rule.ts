import { RuleId, RuleMatch, RuleMode, CompareMode } from "@/core/models";
import { Character } from "@/core/modules/Character";

export abstract class Rule {
    public id?: RuleId;
    public enabled: boolean;
    public mode: RuleMode;
    public list: string[];
    public threshold: number;
    public compareMode: CompareMode = CompareMode.Exact;

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
        const matches: RuleMatch[] = this.getMatches(character);

        for (const match of matches) {
            switch (this.compareMode) {
                case CompareMode.Exact:
                    this.determineIfMatchViolationExact(match);
                    break;
                case CompareMode.Include:
                    this.determineIfMatchViolationInclude(match);
                    break;
            }
        }

        return matches;
    }

    private determineIfMatchViolationExact(match: RuleMatch): void {
        if (this.mode === RuleMode.Whitelist && !this.list.includes(match.compare)) {
            match.isViolation = true;
        }

        if (this.mode === RuleMode.Blacklist && this.list.includes(match.compare)) {
            match.isViolation = true;
        }
    }

    private determineIfMatchViolationInclude(match: RuleMatch): void {
        // TODO
    }

    public abstract getMatches(character: Character): RuleMatch[];
}
