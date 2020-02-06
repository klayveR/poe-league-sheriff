import config from "config";
import express from "express";
import { DateTime } from "luxon";
import sassMiddleware from "node-sass-middleware";
import path from "path";

import { Database } from "@/shared/Database";
import { CachedLadderCharacter, CacheSchema } from "@/shared/models/CacheSchema";

const app = express();
const port = 8080;
const db = new Database();

const luxonLocaleSettings = {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
};

function getCachedData(db: Database): CacheSchema {
    const data: CacheSchema = {
        ladder: [],
        violations: {},
    };

    const characters = db.getCharacters();
    const perPage = 15;

    for (let i = 0; i < characters.length; i++) {
        // Add a new page to ladder
        if (i % perPage === 0) {
            data.ladder.push([]);
        }

        // Get last page index
        const pageIdx = data.ladder.length - 1;

        const character = characters[i];
        const violations = db.getCharacterViolations(character.character.id);

        // Format violation times
        for (const violation of violations) {
            const occuredTime = DateTime.fromMillis(parseInt(violation.occured.time));
            violation.occured.time = occuredTime.toLocaleString(luxonLocaleSettings);

            if (violation.resolved) {
                const resolvedTime = DateTime.fromMillis(parseInt(violation.resolved.time));
                // eslint-disable-next-line no-useless-escape
                violation.resolved.time = resolvedTime
                    .diff(occuredTime)
                    .toFormat("d 'days,' h 'hours,' m 'minutes'");
            }
        }

        const active = violations.filter((vio) => vio.resolved == null);
        const resolved = violations.filter((vio) => vio.resolved != null);

        // Add cached ladder character
        const entry: CachedLadderCharacter = {
            ...{
                violations: {
                    active: active.length,
                    resolved: resolved.length,
                },
            },
            ...character,
        };

        data.ladder[pageIdx].push(entry);

        // Add cached character violations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.violations[character.character.id as any] = violations;
    }

    return data;
}

(async (): Promise<void> => {
    await db.init();

    const cachedData = getCachedData(db);
    const rules = config.get("rules");
    const leagueName = config.get("name");

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    app.use(
        sassMiddleware({
            src: path.join(__dirname, "scss"),
            dest: path.join(__dirname, "public", "css"),
            debug: true,
            outputStyle: "compressed",
            prefix: "/css", // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
        })
    );

    app.use(express.static(path.join(__dirname, "public")));

    app.get("/", (req, res) => {
        res.render("index", { leagueName, pageCount: cachedData.ladder.length });
    });

    app.get("/rules", (req, res) => {
        res.render("rules", { rules });
    });

    app.get("/violations", (req, res) => {
        if (req.query.cid == null) {
            res.status(404).send();
        }

        res.render("partial/violations", {
            violations: cachedData.violations[req.query.cid] || [],
        });
    });

    app.get("/ladder", (req, res) => {
        if (req.query.page == null) {
            res.status(404).send();
        }

        res.render("partial/ladder", {
            ladder: cachedData.ladder[req.query.page] || [],
        });
    });

    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
})();
