import { RuleId, RuleMode, RuleViolation } from "@/core/models";

import { Character } from "./Character";

export abstract class Rule {
    public id: RuleId;
    public mode: RuleMode;
    public list: string[];

    constructor(id: RuleId, mode: RuleMode = RuleMode.Whitelist, list: string[] = []) {
        this.id = id;
        this.mode = mode;
        this.list = list;
    }

    public getViolations(character: Character): RuleViolation[] {
        const violations: RuleViolation[] = [];
        const possibleViolations: RuleViolation[] = this.getPossibleViolations(character);

        for (const violation of possibleViolations) {
            if (this.mode === RuleMode.Whitelist && !this.list.includes(violation.text)) {
                violations.push(violation);
            }

            if (this.mode === RuleMode.Blacklist && this.list.includes(violation.text)) {
                violations.push(violation);
            }
        }

        return violations;
    }

    public abstract getPossibleViolations(character: Character): RuleViolation[];
}
