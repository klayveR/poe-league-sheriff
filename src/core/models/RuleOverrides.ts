import { RuleId } from "./RuleId";

export const RuleOverrides: Map<RuleId, RuleId[]> = new Map<RuleId, RuleId[]>([
    [RuleId.LinkedGem, [RuleId.Gem, RuleId.Corrupted]],
    [RuleId.JewelRarity, [RuleId.ItemRarity, RuleId.Corrupted, RuleId.BaseType]],
    [RuleId.FlaskRarity, [RuleId.ItemRarity, RuleId.Corrupted, RuleId.BaseType]],
    [RuleId.AbyssJewelRarity, [RuleId.ItemRarity, RuleId.Corrupted, RuleId.BaseType]],
    [RuleId.ItemRarity, [RuleId.Corrupted, RuleId.BaseType]],
    [
        RuleId.Unique,
        [
            RuleId.ItemRarity,
            RuleId.FlaskRarity,
            RuleId.JewelRarity,
            RuleId.AbyssJewelRarity,
            RuleId.Influence,
            RuleId.Corrupted,
            RuleId.BaseType,
        ],
    ],
]);
