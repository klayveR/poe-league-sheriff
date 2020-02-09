import axios from "axios";
import querystring from "querystring";
import joinUrl from "url-join";

import { LeagueData } from "@/core/models";

import { getPercentage } from "../utility/getPercentage";
import { interactive } from "./Logger";
import { RateLimiter } from "./RateLimiter";

export class League {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public data: LeagueData = {} as any;
    public name: string;

    private offsetInc = 200;

    constructor(name: string) {
        this.name = name;
    }

    public async getFull(): Promise<void> {
        interactive.await(`[0%] - Fetching league data`);
        this.data = await this.get();

        const pageCount = Math.ceil(this.data.ladder.total / this.offsetInc);

        let offset = this.offsetInc;
        while (this.data.ladder.total > offset) {
            const percentage = getPercentage(offset / this.offsetInc + 1, pageCount);
            interactive.await(`[${percentage}%] - Fetching league ladder entries`);

            const addData = await this.get(offset);
            this.data.ladder.entries.push(...addData.ladder.entries);

            offset += this.offsetInc;
        }
    }

    public async get(offset = 0): Promise<LeagueData> {
        const encodedName = querystring.escape(this.name);
        const baseUrl = "http://api.pathofexile.com/leagues/";
        const url = joinUrl(
            baseUrl,
            encodedName,
            "?ladder=1",
            "&ladderTrack=1",
            `&ladderLimit=${this.offsetInc}`,
            `&ladderOffset=${offset}`
        );
        const response = await RateLimiter.schedule(() => axios.get(url, { timeout: 30000 }));

        const data: LeagueData = response.data as LeagueData;
        return data;
    }

    public getId(): string {
        const pattern = /^.+?\(PL(\d+)\)$/m;
        const match = pattern.exec(this.data.id);

        if (match) {
            return match[1];
        }

        return "0";
    }
}
