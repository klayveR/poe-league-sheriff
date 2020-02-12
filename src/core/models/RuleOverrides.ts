import { RuleId } from "./RuleId";

export const RuleOverrides: Map<RuleId, RuleId[]> = new Map<RuleId, RuleId[]>([
    [RuleId.LinkedGem, [RuleId.Gem, RuleId.Corrupted]],
    [RuleId.JewelRarity, [RuleId.ItemRarity, RuleId.Corrupted]],
    [RuleId.FlaskRarity, [RuleId.ItemRarity, RuleId.Corrupted]],
    [RuleId.AbyssJewelRarity, [RuleId.ItemRarity, RuleId.Corrupted]],
    [RuleId.ItemRarity, [RuleId.Corrupted]],
    [
        RuleId.Unique,
        [
            RuleId.ItemRarity,
            RuleId.FlaskRarity,
            RuleId.JewelRarity,
            RuleId.AbyssJewelRarity,
            RuleId.Influence,
            RuleId.Corrupted,
        ],
    ],
]);
