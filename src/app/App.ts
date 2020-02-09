import apicache from "apicache";
import express from "express";
import sassMiddleware from "node-sass-middleware";
import path from "path";

import { Sheriff } from "@/core/Sheriff";

const app = express();
const port = 8080;
const sheriff = new Sheriff();
const perPage = 25;
const cache = apicache.middleware;

(async (): Promise<void> => {
    await sheriff.init();
    sheriff.run();
})();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
    sassMiddleware({
        src: path.join(__dirname, "scss"),
        dest: path.join(__dirname, "public", "css"),
        debug: false,
        outputStyle: "compressed",
        prefix: "/css",
    })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(cache("10 seconds"));

app.get("/", (req, res) => {
    const pages = Math.ceil(sheriff.cache.ladder.length / perPage);

    res.render("index", {
        lastUpdate: sheriff.cache.lastUpdate,
        leagueName: sheriff.leagueName,
        pageCount: pages,
        rules: sheriff.rules,
    });
});

app.get("/violations/:cid", (req, res) => {
    const cid = req.params.cid;
    const data = sheriff.cache.ladder.find((entry) => entry.character.id === cid);

    if (data == null) {
        res.status(400).send();
        return;
    }

    res.render("partial/violations", {
        character: data,
    });
});

app.get("/ladder/:page", (req, res) => {
    const page = parseInt(req.params.page);
    const start = page * perPage;
    const end = start + perPage;
    const entries = sheriff.cache.ladder.slice(start, end);

    res.render("partial/ladder", {
        ladder: entries || [],
    });
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
