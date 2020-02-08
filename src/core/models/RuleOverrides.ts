import { RuleId } from "./RuleId";

export const RuleOverrides: Map<RuleId, RuleId[]> = new Map<RuleId, RuleId[]>([
    [RuleId.LinkedGem, [RuleId.Gem]],
    [RuleId.JewelRarity, [RuleId.ItemRarity]],
    [RuleId.FlaskRarity, [RuleId.ItemRarity]],
    [RuleId.Unique, [RuleId.ItemRarity, RuleId.FlaskRarity, RuleId.JewelRarity, RuleId.Influence]],
]);
