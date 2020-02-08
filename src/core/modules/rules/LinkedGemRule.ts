import { RuleId, RuleMatch, SocketedItemsEntity } from "@/core/models";
import { Character } from "@/core/modules/Character";
import { Rule } from "@/core/modules/Rule";
import crypto from "crypto";
import { getGemLevel } from "@/core/utility";

export class LinkedGemRule extends Rule {
    public id = RuleId.LinkedGem;

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
                // Skip gem if level is below threshold
                const gemLevel = getGemLevel(activeGem);
                if (gemLevel && gemLevel < this.threshold) {
                    continue;
                }

                // Get support gems which support the current active skill gem
                const linkedSupports: SocketedItemsEntity[] = [];
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
                    display: `${activeGem.typeLine}${
                        gemLevel != null ? ` (Level ${gemLevel})` : ``
                    } (${socketedItemsTypeLines.join(", ")})`,
                    isViolation: false,
                };

                matches.push(match);
            }
        }

        return matches;
    }
}
