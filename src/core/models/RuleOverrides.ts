import { RuleId } from "./RuleId";

export const RuleOverrides: Map<RuleId, RuleId[]> = new Map<RuleId, RuleId[]>([
    [RuleId.JewelRarity, [RuleId.ItemRarity]],
    [RuleId.FlaskRarity, [RuleId.ItemRarity]],
    [RuleId.Unique, [RuleId.ItemRarity, RuleId.FlaskRarity, RuleId.JewelRarity, RuleId.Influence]],
]);
