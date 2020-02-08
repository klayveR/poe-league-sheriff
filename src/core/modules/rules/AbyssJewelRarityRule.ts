import { FrameType, RuleId, RuleMatch, SocketedItemsEntity } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import { getItemName } from "@/core/utility";

export class AbyssJewelRarityRule extends Rule {
    public id = RuleId.AbyssJewelRarity;

    public getMatches(character: Character): RuleMatch[] {
        const jewels = character.passiveItems;

        // Get jewels from items with abyssal sockets
        const items = character.items;
        for (const item of items) {
            if (!item.socketedItems) {
                continue;
            }

            const socketedJewel: SocketedItemsEntity[] = item.socketedItems.filter(
                (item) => item.abyssJewel
            );

            jewels.push(...socketedJewel);
        }

        const matches: RuleMatch[] = [];
        for (const jewel of jewels) {
            const rarity = FrameType[jewel.frameType];
            const match: RuleMatch = {
                rule: this.id,
                id: jewel.id,
                compare: rarity,
                display: `${getItemName(jewel.name, jewel.typeLine)} (${rarity})`.trim(),
                isViolation: false,
            };

            matches.push(match);
        }

        return matches;
    }
}
