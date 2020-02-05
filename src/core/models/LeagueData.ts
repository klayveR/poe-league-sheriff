export interface LeagueData {
    id: string;
    realm: string;
    description: string;
    url: string | null;
    startAt: string;
    endAt: string;
    delveEvent: boolean;
    rules: LeagueRule[];
    ladder: {
        total: number;
        cached_since?: string;
        entries: LadderCharacter[];
    };
}

export interface LeagueRule {
    id: string;
    name: string;
    description: string;
}

export interface LadderCharacter {
    rank: number;
    dead: boolean;
    retired?: boolean;
    online: boolean;
    character: {
        name: string;
        level: number;
        class: string;
        id: string;
        experience: number;
        depth: {
            default: number;
            solo: number;
        };
    };
    account: {
        name: string;
        realm: string;
        challenges: {
            total: number;
        };
    };
}
