import { SocketedItemsEntity } from "@/core/models";

export function getGemLevel(gem: SocketedItemsEntity): number | undefined {
    if (!gem.properties) {
        return;
    }

    const levelProp = gem.properties.find((prop) => prop.name === "Level");
    if (
        levelProp &&
        levelProp.values &&
        levelProp.values.length > 0 &&
        levelProp.values[0].length > 0 &&
        typeof levelProp.values[0][0] === "string"
    ) {
        const gemLevel = parseInt(levelProp.values[0][0]);

        return gemLevel;
    }
}
