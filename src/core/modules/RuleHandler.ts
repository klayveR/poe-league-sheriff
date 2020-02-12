import config from "config";
import { countBy } from "lodash";
import signale from "signale";

import { RuleMatch, RuleOverrides, RuleViolation } from "@/core/models";
import * as Rules from "@/core/modules/rules";
import { Database } from "@/shared";
import { DatabaseViolation } from "@/shared/models";
import { ConfigRule } from "@/shared/models/ConfigSchema";

import { Character } from "./Character";
import { Rule } from "./Rule";

export class RuleHandler {
    private rules: Rule[];
    public db: Database;

    constructor(db: Database) {
        this.db = db;
        this.rules = [
            new Rules.NoPrivateProfileRule(true),
            new Rules.CharacterClassRule(),
            new Rules.FlaskRarityRule(),
            new Rules.GemRule(),
            new Rules.ItemInfluenceRule(),
            new Rules.ItemRarityRule(),
            new Rules.JewelRarityRule(),
            new Rules.PassiveRule(),
            new Rules.UniqueRule(),
            new Rules.LinkedGemRule(),
            new Rules.AbyssJewelRarityRule(),
            new Rules.CorruptedRule(),
            new Rules.AffixRule(),
        ];
    }

    public enableConfigRules(): void {
        if (!config.has("rules")) {
            return;
        }

        signale.start("Enabling rules from config");

        const configRules = config.get<{ [key: string]: ConfigRule }>("rules");
        for (const [ruleId, rule] of Object.entries(configRules)) {
            for (const ruleInstance of this.rules) {
                if (ruleInstance.id !== ruleId) {
                    continue;
                }

                if (rule.enabled) {
                    signale.info(`${rule.display} (${rule.mode}, ${rule.list.length} in list)`);
                    ruleInstance.enabled = true;
                    ruleInstance.mode = rule.mode;
                    ruleInstance.list = rule.list;

                    if (rule.threshold) {
                        ruleInstance.threshold = rule.threshold;
                    }
                }
            }
        }
    }

    public check(character: Character): void {
        const violations = this.getViolations(character);

        this.checkViolations(character, violations);
        this.checkResolved(character, violations);
    }

    private getViolations(character: Character): RuleViolation[] {
        const all: RuleMatch[] = [];

        // Initially, get all instances that match the rules
        for (const rule of this.rules) {
            if (rule.enabled) {
                const matches = rule.getRuleMatches(character);
                all.push(...matches);
            }
        }

        const counts = countBy(all, "id");
        const violations: RuleViolation[] = [];

        for (const id in counts) {
            const count = counts[id];
            const duplicates = all.filter((violation) => violation.id === id);
            const not = duplicates.filter((violation) => !violation.isViolation);

            // If all duplicates aren't violations, skip this id
            if (not.length === duplicates.length) {
                continue;
            }

            // Assume the first potential violation is correct
            let found: RuleMatch = duplicates[0];

            // If there are duplicates, iterate over the following entries and find the correct one
            if (count > 1) {
                for (let i = 1; i < duplicates.length; i++) {
                    const duplicate = duplicates[i];
                    const overrides = RuleOverrides.get(duplicate.rule);

                    // If the current entry overrides the previous assumption, assume this one
                    if (overrides && overrides.includes(found.rule)) {
                        found = duplicate;
                    }
                }
            }

            if (found.isViolation) {
                const violation: RuleViolation = {
                    rule: found.rule,
                    id: found.id,
                    display: found.display,
                };

                violations.push(violation);
            }
        }

        return violations;
    }

    private checkViolations(character: Character, violations: RuleViolation[]): void {
        for (const violation of violations) {
            this.db.addViolation(character.data, violation);
        }
    }

    private checkResolved(character: Character, violations: RuleViolation[]): void {
        const dbViolations: DatabaseViolation[] = this.db.getCharacterViolations(
            character.data.character.id,
            true,
            false
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
