import config from "config";
import { DateTime } from "luxon";

import { LadderCharacter } from "@/core/models";
import { CachedLadderCharacter, CacheSchema, CacheViolation } from "@/core/models/CacheSchema";
import { Character, interactive, League, RuleHandler, signale } from "@/core/modules";
import { getPercentage } from "@/core/utility";
import { Database } from "@/shared";
import { ConfigRule, ConfigRules } from "@/shared/models";
import { cloneDeep } from "lodash";

import { getExperiencePercentage } from "./utility/getExperiencePercentage";

export class Sheriff {
    private database: Database;
    private ruleHandler: RuleHandler;
    private league: League;
    private running: boolean;
    private initialized: boolean;

    public leagueName: string;
    public rules: ConfigRules;
    public cache: CacheSchema;

    constructor() {
        this.leagueName = config.get<string>("name");
        this.rules = config.get<ConfigRules>("rules");

        this.database = new Database();
        this.ruleHandler = new RuleHandler(this.database);
        this.league = new League(this.leagueName);

        this.cache = {
            lastUpdate: Date.now.toString(),
            ladder: [],
        };

        this.running = false;
        this.initialized = false;
    }

    public async init(): Promise<void> {
        await this.database.init();
        this.cache = this.getUpdatedCache();
        this.ruleHandler.enableConfigRules();

        this.initialized = true;
    }

    public async run(): Promise<void> {
        if (!this.initialized) {
            throw new Error(`Please call init() before attempting to run`);
        }

        if (this.running) {
            return;
        }

        this.running = true;

        while (this.running) {
            await this.doCycle();
        }
    }

    public stopAfterCurrentCycle(): void {
        this.running = false;
    }

    private async doCycle(): Promise<void> {
        try {
            await this.league.getFull();
            interactive.success(`Fetched league data for ${this.league.name}`);
        } catch (e) {
            interactive.error(`Failed to fetch league data for ${this.league.name}`);
            return;
        }

        this.determineCharactersToCheck();

        const dbCheckReq = this.database.getCheckRequirements();
        interactive.info(`${dbCheckReq.length} characters have to be checked for violations`);

        // Update ladder data in database
        this.database.updateLadder(this.league.data.ladder.entries);

        // Fetch character data for characters which have to be checked
        signale.start(`Fetching character data and checking for violations`);

        const promises = [];
        for (let i = 0; i < dbCheckReq.length; i++) {
            promises.push(this.processCharacter(dbCheckReq[i], i, dbCheckReq.length));
        }

        // Wait for all character data requests to complete
        await Promise.all(promises);

        signale.info(`Updating cache`);
        this.cache = this.getUpdatedCache();

        signale.success(`Done!`);
    }

    private determineCharactersToCheck(): void {
        const databaseChars: LadderCharacter[] = this.database.getCharacters();
        const checkCharacterIds: string[] = [];
        for (let i = 0; i < this.league.data.ladder.entries.length; i++) {
            const char = this.league.data.ladder.entries[i];
            const databaseChar = databaseChars.find(
                (dbChar) => dbChar.character.id === char.character.id
            );

            // Add character if it has never been checked before
            if (databaseChar == null) {
                if (
                    !char.retired &&
                    char.character.level >= config.get<number>("ignoreCharactersBelowLevel")
                ) {
                    checkCharacterIds.push(char.character.id);
                }
            } else if (!databaseChar.dead) {
                // Add character if experience progressed
                if (char.character.experience > databaseChar.character.experience) {
                    checkCharacterIds.push(char.character.id);
                }

                // Add character if level is 100 and player is online
                else if (char.character.level === 100 && char.online) {
                    checkCharacterIds.push(char.character.id);
                }
            }
        }

        // Add check ids to database
        this.database.addCheckRequirements(checkCharacterIds);
    }

    private async processCharacter(
        characterId: string,
        count: number,
        total: number
    ): Promise<void> {
        const ladderChar = this.database.getCharacter(characterId);

        if (!ladderChar) {
            return;
        }

        let checkCharacter = true;
        let removeRequirement = true;
        const percentage = getPercentage(count, total);
        const character = new Character(ladderChar);
        try {
            await character.getEquippedItems();
            await character.getAllocatedPassives();
            interactive.success(`[${percentage}%] ${ladderChar.character.name}`);
        } catch (e) {
            switch (e.response.status) {
                case 403:
                    interactive.warn(
                        `[${percentage}%] ${ladderChar.character.name} - Character tab or profile private`
                    );
                    break;
                case 404:
                    interactive.warn(
                        `[${percentage}%] ${ladderChar.character.name} - Character deleted`
                    );
                    checkCharacter = false;
                    break;
                default:
                    signale.error(
                        `[${percentage}%] ${ladderChar.character.name} - An error occured`,
                        e.message
                    );
                    removeRequirement = false;
                    checkCharacter = false;
            }
        }

        if (checkCharacter) {
            this.ruleHandler.check(character);
        }

        if (removeRequirement) {
            this.database.removeCheckRequirement(characterId);
        }
    }

    private getUpdatedCache(): CacheSchema {
        const cache: CacheSchema = {
            lastUpdate: Date.now().toString(),
            ladder: [],
        };

        const characters = this.database.getCharacters();
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            const characterId = character.character.id;

            // Format experience
            character.character.experience = getExperiencePercentage(
                character.character.experience
            );

            // Get all violations of character
            const active = this.database.getCharacterViolations(characterId, true, false);
            const resolved = this.database.getCharacterViolations(characterId, false, true);
            const violations = [...(active as CacheViolation[]), ...(resolved as CacheViolation[])];

            // Add cached ladder character
            const entry: CachedLadderCharacter = {
                ...{
                    violations: {
                        entries: cloneDeep(violations),
                        active: active.length,
                        resolved: resolved.length,
                    },
                },
                ...cloneDeep(character),
            };

            for (const violation of entry.violations.entries) {
                // Format rule display name
                if (config.has(`rules.${violation.rule}`)) {
                    violation.ruleDisplay = config.get<ConfigRule>(
                        `rules.${violation.rule}`
                    ).display;
                } else {
                    violation.ruleDisplay = violation.rule;
                }

                // Format experience
                violation.occured.experience = getExperiencePercentage(
                    violation.occured.experience
                );

                // Format time
                const occuredTime = DateTime.fromMillis(parseInt(violation.occured.time));
                const relativeTime = occuredTime.toRelative();

                if (relativeTime) {
                    violation.occured.time = relativeTime;
                } else {
                    violation.occured.time = occuredTime.toISOTime();
                }

                if (violation.resolved) {
                    // Format experience
                    violation.resolved.experience = getExperiencePercentage(
                        violation.resolved.experience
                    );

                    const resolvedTime = DateTime.fromMillis(parseInt(violation.resolved.time));

                    violation.resolved.time = resolvedTime
                        .diff(occuredTime)
                        .toFormat("d 'days,' h 'hours,' m 'minutes'");
                }
            }

            cache.ladder.push(entry);
        }

        return cache;
    }
}
