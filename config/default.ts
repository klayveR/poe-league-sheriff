export default {
    name: "Bakers Boomer League aka Classic (PL7494)",
    rules: {
        influence: {
            enabled: false,
            display: "Item Influence",
            mode: "blacklist",
            list: [],
        },
        gem: {
            enabled: false,
            display: "Gems",
            mode: "blacklist",
            list: [],
        },
        class: {
            enabled: false,
            display: "Character Class",
            mode: "blacklist",
            list: [],
        },
        passive: {
            enabled: false,
            display: "Passive Skills",
            mode: "blacklist",
            list: [],
        },
        jewelRarity: {
            enabled: false,
            display: "Jewel Rarity",
            mode: "blacklist",
            list: [],
        },
        itemRarity: {
            enabled: true,
            display: "Item Rarity",
            mode: "whitelist",
            list: ["Unique"],
        },
        flaskRarity: {
            enabled: true,
            display: "Flask Rarity",
            mode: "blacklist",
            list: [],
        },
        unique: {
            enabled: false,
            display: "Unique Items",
            mode: "blacklist",
            list: [],
        },
    },
};
