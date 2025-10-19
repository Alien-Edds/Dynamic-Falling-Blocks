import { EntityBehavior } from "./manager";
import { FallingBlock } from "./data/fallingBlock";

export const EntityBehaviorData: { [id: string]: EntityBehavior; } = {
    "ae_dfb:falling_block": FallingBlock.behavior
};