import { RuleId, RuleMatch, RuleMode, SocketedItemsEntity } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import crypto from "crypto";

export class LinkedGemRule extends Rule {
    constructor(enabled = false, mode: RuleMode = RuleMode.Blacklist, list: string[] = []) {
        super(enabled, RuleId.LinkedGem, mode, list);
    }

    public getMatches(character: Character): RuleMatch[] {
        const matches: RuleMatch[] = [];

        for (const item of character.items) {
            if (!item.sockets || !item.socketedItems) {
                continue;
            }

            let gems: SocketedItemsEntity[] = item.socketedItems;

            gems = gems.filter((gem) => gem.frameType === 4);

            const activeGems = gems.filter((gem) => gem.support === false);
            const supportGems = gems.filter((gem) => gem.support === true);
            const groups = item.sockets.map((socket) => socket.group);

            for (const activeGem of activeGems) {
                const linkedSupports: SocketedItemsEntity[] = [];

                // Get support gems which support the current active skill gem
                for (const supportGem of supportGems) {
                    if (groups[activeGem.socket] === groups[supportGem.socket]) {
                        linkedSupports.push(supportGem);
                    }
                }

                if (linkedSupports.length === 0) {
                    continue;
                }

                const socketedItemsTypeLines = linkedSupports.map((gem) => gem.typeLine);
                const socketedItemsIds = linkedSupports.map((gem) => gem.id);
                const idString = [activeGem.id, ...socketedItemsIds].join(",");

                // Use a hash of active + support gem ids as id, so next check can act accordingly
                // if link configuration changes
                const hash = crypto
                    .createHash("md5")
                    .update(idString)
                    .digest("hex");

                const match: RuleMatch = {
                    rule: this.id,
                    id: hash,
                    compare: activeGem.typeLine,
                    display: `${activeGem.typeLine} (${socketedItemsTypeLines.join(", ")})`,
                    isViolation: false,
                };

                matches.push(match);
            }
        }

        return matches;
    }
}
