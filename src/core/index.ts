import config from "config";
import { Database } from "@/shared/Database";
import { LadderCharacter } from "@/core/models/LeagueData";
import { Character, League, RuleHandler, interactive, signale } from "@/core/modules";
import { getPercentage } from "./utility/getPercentage";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugEntry: LadderCharacter = {
    rank: 0,
    dead: false,
    online: false,
    character: {
        name: "Ectro_ZDPSLeague",
        level: 93,
        class: "Saboteur",
        id: "a593dca4e42e5914ff2cb871b6e05ff0b25a9639dd8398f220f6df956b731672",
        experience: 2526913272,
        depth: {
            default: 69,
            solo: 69,
        },
    },
    account: {
        name: "Ectro88",
        realm: "pc",
        challenges: {
            total: 29,
        },
    },
};

const update = async (database: Database, ruleHandler: RuleHandler): Promise<void> => {
    signale.start("Starting update process");

    // Fetch league data
    const leagueName = config.get<string>("name");
    const league = new League(leagueName);
    try {
        await league.getFull();
        interactive.success(`Fetched league data for ${league.name}`);
    } catch (e) {
        interactive.error(`Failed to fetch league data for ${league.name}`);
        return;
    }

    const checkCharacterIds: string[] = [];
    let prevPercentage = 0;
    for (let i = 0; i < league.data.ladder.entries.length; i++) {
        const char = league.data.ladder.entries[i];
        const databaseChar: LadderCharacter | undefined = database.getCharacter(char.character.id);

        // Only render output if percentage changed
        const percentage = getPercentage(i + 1, league.data.ladder.entries.length);
        if (percentage > prevPercentage) {
            prevPercentage = percentage;
            interactive.await(
                `[${percentage}%] Determining which characters have to be checked for violations`
            );
        }

        // Add character if it has never been checked before
        if (databaseChar == null) {
            if (
                !char.retired &&
                char.character.level >= config.get<number>("threshold.characterLevel")
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
    database.addCheckRequirements(checkCharacterIds);
    const dbCheckReq = database.getCheckRequirements();
    interactive.info(`${dbCheckReq.length} characters have to be checked for violations`);

    // Update ladder data in database
    database.updateLadder(league.data.ladder.entries);

    // Fetch character data for characters which have to be checked
    signale.start(`Fetching character data and checking for violations`);

    const promises = [];
    for (let i = 0; i < dbCheckReq.length; i++) {
        promises.push(processCharacter(dbCheckReq[i], database, ruleHandler, i, dbCheckReq.length));
    }

    await Promise.all(promises);
    interactive.success(`Done!`);
};

async function processCharacter(
    characterId: string,
    database: Database,
    ruleHandler: RuleHandler,
    count: number,
    total: number
): Promise<void> {
    const ladderChar = database.getCharacter(characterId);

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
        ruleHandler.check(character);
    }

    if (removeRequirement) {
        database.removeCheckRequirement(characterId);
    }
}

(async (): Promise<void> => {
    // Database
    signale.info(`Initializing database`);
    const database = new Database();
    await database.init();

    // Rules handler
    signale.info(`Adding rules`);
    const ruleHandler = new RuleHandler(database);
    //ruleHandler.addRules(rules);
    ruleHandler.enableConfigRules();

    // eslint-disable-next-line no-constant-condition
    while (true) {
        await update(database, ruleHandler);
    }
})();
