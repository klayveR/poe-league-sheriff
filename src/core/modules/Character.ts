import axios from "axios";
import querystring from "querystring";

import { CharacterItems, SocketedItemsEntity } from "@/core/models/CharacterItems";
import { LadderCharacter } from "@/core/models/LeagueData";

import { RateLimiter } from "./RateLimiter";

export class Character {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public data: LadderCharacter;
    public items: CharacterItems = [];
    public passiveHashes: number[] = [];
    public passiveItems: SocketedItemsEntity[] = [];
    public private = false;

    constructor(ladderChar: LadderCharacter) {
        this.data = ladderChar;
    }

    public async getEquippedItems(): Promise<void> {
        const encodedCharacterName = querystring.escape(this.data.character.name);
        const encodedAccountName = querystring.escape(this.data.account.name);

        const url = `https://www.pathofexile.com/character-window/get-items?character=${encodedCharacterName}&accountName=${encodedAccountName}`;

        try {
            const response = await RateLimiter.schedule(() => axios.get(url, { timeout: 30000 }));
            const data = response.data;

            this.items = data.items as CharacterItems;
            this.items = this.items.filter(
                (item) =>
                    ["MainInventory", "Weapon2", "Offhand2"].includes(item.inventoryId) === false
            );
        } catch (error) {
            if (error.response.status === 403) {
                this.private = true;
            }

            throw error;
        }
    }

    public async getAllocatedPassives(): Promise<void> {
        const encodedCharacterName = querystring.escape(this.data.character.name);
        const encodedAccountName = querystring.escape(this.data.account.name);

        const url = `https://www.pathofexile.com/character-window/get-passive-skills?reqData=0&character=${encodedCharacterName}&accountName=${encodedAccountName}`;

        const response = await axios.get(url, { timeout: 30000 });
        const data = response.data;

        this.passiveHashes = data.hashes;
        this.passiveItems = data.items;
    }
}
