import config from "config";
import { countBy, forEach } from "lodash";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPercentage } from "@/core/utility/getPercentage";
import { Database, signale } from "@/shared";
import { ConfigRule } from "@/shared/models/ConfigSchema";

function showStats(database: Database): void {
    const rankLimit = 1000;
    const percentage = getViolationCounts(database, rankLimit);

    signale.info(
        `${percentage.total}% of alive characters (Rank <= ${rankLimit}) are violating one or more rules`
    );

    forEach(percentage.individual, (value, key) => {
        let ruleName = key;
        if (config.has(`rules.${key}.display`)) {
            ruleName = config.get<ConfigRule>(`rules.${key}`).display;
        }

        signale.info(
            `${value}% of alive characters (Rank <= ${rankLimit}) are violating the "${ruleName}" rule`
        );
    });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getViolationCounts(database: Database, rankLimit = 0) {
    let characters = database.getCharacters();
    characters = characters.filter((char) => !char.dead && !char.retired);

    if (rankLimit > 0) {
        characters = characters.filter((char) => char.rank <= rankLimit);
    }

    const violationCounts = {
        total: 0,
        individual: {},
    };
    for (const char of characters) {
        const violations = database.getCharacterViolations(char.character.id, true, false);

        if (violations.length > 0) {
            const uniqViolations = countBy(violations, "rule");

            forEach(uniqViolations, (value, key) => {
                if ((violationCounts.individual as any)[key] != null) {
                    (violationCounts.individual as any)[key] =
                        (violationCounts.individual as any)[key] + 1;
                } else {
                    (violationCounts.individual as any)[key] = 1;
                }
            });

            violationCounts.total++;
        }
    }

    forEach(violationCounts.individual, (value, key) => {
        (violationCounts.individual as any)[key] = getPercentage(value, characters.length, false);
    });

    violationCounts.total = getPercentage(violationCounts.total, characters.length, false);

    return violationCounts;
}

(async (): Promise<void> => {
    // Database
    signale.info(`Initializing database`);
    const database = new Database();
    await database.init();

    showStats(database);
})();
