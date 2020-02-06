import { CharacterItem, RuleId, RuleMatch, RuleMode } from "@/core/models";
import { Character, Rule } from "@/core/modules";

export class ItemInfluenceRule extends Rule {
    constructor(mode: RuleMode, list: string[] = []) {
        super(RuleId.Influence, mode, list);
    }

    public getMatches(character: Character): RuleMatch[] {
        const items = [...character.items, ...character.passiveItems];

        const matches: RuleMatch[] = [];
        for (const item of items) {
            if (!item.influences) {
                continue;
            }

            Object.entries(item.influences).forEach(([type, hasInfluence]) => {
                if (hasInfluence) {
                    const violation: RuleMatch = {
                        rule: this.id,
                        id: item.id,
                        compare: this.getUppercasedInfluence(type),
                        display: `${item.name} ${item.typeLine} (${this.getInfluencesAsString(
                            item
                        )})`.trim(),
                        isViolation: false,
                    };

                    matches.push(violation);
                }
            });
        }

        return matches;
    }

    private getUppercasedInfluence(influence: string): string {
        return `${influence[0].toUpperCase() + influence.slice(1)}`;
    }

    private getInfluencesAsString(item: CharacterItem): string {
        if (!item.influences) {
            return "";
        }

        const influences: string[] = [];
        Object.entries(item.influences).forEach(([type, hasInfluence]) => {
            if (hasInfluence) {
                influences.push(this.getUppercasedInfluence(type));
            }
        });

        return influences.join(", ");
    }
}
