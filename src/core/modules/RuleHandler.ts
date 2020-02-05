import { DatabaseViolation, RuleViolation } from "@/core/models";

import { Database } from "../../shared/Database";
import { Character } from "./Character";
import { Rule } from "./Rule";

export class RuleHandler {
    private rules: Rule[] = [];
    public db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    public addRule(rule: Rule): void {
        this.rules.push(rule);
    }

    public addRules(rules: Rule[]): void {
        this.rules.push(...rules);
    }

    public check(character: Character): void {
        // TODO:
        // track non violation ids
        // track all violations instead
        // remove conflicting after
        for (const rule of this.rules) {
            const violations = rule.getViolations(character);

            this.checkViolations(character, violations);
            this.checkResolved(character, violations, rule);
        }
    }

    private checkViolations(character: Character, violations: RuleViolation[]): void {
        for (const violation of violations) {
            this.db.addViolation(character.data, violation);
        }
    }

    private checkResolved(character: Character, violations: RuleViolation[], rule: Rule): void {
        const dbViolations: DatabaseViolation[] = this.db.getCharacterRuleViolations(
            character.data.character.id,
            rule
        );

        for (const dbViolation of dbViolations) {
            const activeViolation: RuleViolation | undefined = violations.find(
                (vio) => vio.id === dbViolation.id && vio.rule === dbViolation.rule
            );

            if (!activeViolation) {
                this.db.resolveViolation(character.data, dbViolation);
            }
        }
    }
}
