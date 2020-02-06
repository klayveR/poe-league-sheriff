import config from "config";

import { Database } from "../shared/Database";
import { LadderCharacter } from "./models/LeagueData";
import { Character, League, Rule, RuleHandler } from "./modules";
import { interactive, signale } from "./modules/Logger";
import {
    CharacterClassRule,
    GemRule,
    ItemInfluenceRule,
    JewelRarityRule,
    NoPrivateProfileRule,
    PassiveRule,
    UniqueRule,
    FlaskRarityRule,
    ItemRarityRule,
} from "./modules/rules";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugEntry: LadderCharacter = {
    rank: 0,
    dead: false,
    online: false,
    character: {
        name: "Cerija",
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
        name: "klayveR",
        realm: "pc",
        challenges: {
            total: 29,
        },
    },
};

const rules: Rule[] = [
    new NoPrivateProfileRule(),
    new UniqueRule(config.get("rules.unique.mode"), config.get("rules.unique.list")),
    new GemRule(config.get("rules.gem.mode"), config.get("rules.gem.list")),
    new PassiveRule(config.get("rules.passive.mode"), config.get("rules.passive.list")),
    new CharacterClassRule(config.get("rules.class.mode"), config.get("rules.class.list")),
    new ItemRarityRule(config.get("rules.itemRarity.mode"), config.get("rules.itemRarity.list")),
    new FlaskRarityRule(config.get("rules.flaskRarity.mode"), config.get("rules.flaskRarity.list")),
    new JewelRarityRule(config.get("rules.jewelRarity.mode"), config.get("rules.jewelRarity.list")),
    new ItemInfluenceRule(config.get("rules.influence.mode"), config.get("rules.influence.list")),
];

(async (): Promise<void> => {
    // Database
    signale.info(`Initializing database`);
    const database = new Database();
    await database.init();

    // Rules handler
    signale.info(`Adding rules`);
    const ruleHandler = new RuleHandler(database);
    ruleHandler.addRules(rules);

    // Fetch league data
    signale.start(`Fetching league data`);
    const league = new League("Slippery Gucci League (PL7352)");
    try {
        //league.data = await league.get();
        await league.getFull();
        interactive.success(`Fetched league data for ${league.name}`);
    } catch (e) {
        interactive.error(`Failed to fetch league data for ${league.name}`);
        return;
    }

    signale.start(`Determining which characters have to be checked for violations`);

    // Determine which characters have to be checked for violations
    const checkCharacters: LadderCharacter[] = [];
    for (let i = 0; i < league.data.ladder.entries.length; i++) {
        const char = league.data.ladder.entries[i];
        const databaseChar: LadderCharacter | undefined = database.getCharacter(char.character.id);

        interactive.await(`[${i + 1}/${league.data.ladder.entries.length}] ${char.character.name}`);

        // Add character if it has never been checked before
        if (databaseChar == null) {
            if (!char.retired) {
                checkCharacters.push(char);
            }
        } else if (!databaseChar.dead) {
            // Add character if experience progressed
            if (char.character.experience > databaseChar.character.experience) {
                checkCharacters.push(char);
            }

            // Add character if level is 100 and player is online
            else if (char.character.level === 100 && char.online) {
                checkCharacters.push(char);
            }
        }
    }

    interactive.success(`${checkCharacters.length} characters have to be checked for violations`);

    // Update ladder data in database
    database.updateLadder(league.data.ladder.entries);

    // Fetch character data for characters which have to be checked
    signale.start(`Fetching character data and checking for violations`);
    for (let i = 0; i < checkCharacters.length; i++) {
        const ladderChar = checkCharacters[i];
        const character = new Character(ladderChar);

        interactive.await(`[${i + 1}/${checkCharacters.length}] ${ladderChar.character.name}`);

        try {
            await character.getData();
        } catch (e) {
            if (e.response.status !== 403) {
                signale.error(
                    `Failed to fetch character data for account ${character.data.account.name} (${e.message})`
                );
            }
        }

        ruleHandler.check(character);
    }

    interactive.success(`Done!`);
})();
