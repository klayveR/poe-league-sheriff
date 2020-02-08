import { CharacterItem, RuleId, RuleMatch } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";

export class ItemInfluenceRule extends Rule {
    public id = RuleId.Influence;

    public getMatches(character: Character): RuleMatch[] {
        const matches: RuleMatch[] = [];
        for (const item of character.items) {
            if (!item.influences) {
                continue;
            }

            Object.entries(item.influences).forEach(([type, hasInfluence]) => {
                if (hasInfluence) {
                    const match: RuleMatch = {
                        rule: this.id,
                        id: item.id,
                        compare: this.getUppercasedInfluence(type),
                        display: `${item.name} ${item.typeLine} (${this.getInfluencesAsString(
                            item
                        )})`.trim(),
                        isViolation: false,
                    };

                    matches.push(match);
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
