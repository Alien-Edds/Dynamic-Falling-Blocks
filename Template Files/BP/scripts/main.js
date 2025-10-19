import { world } from "@minecraft/server";
import { EntityBehaviors } from "./behaviors/entity/manager";
import { FallingBlock } from "./behaviors/entity/data/fallingBlock";
EntityBehaviors.initialize();
world.afterEvents.playerBreakBlock.subscribe((data) => {
  const above = data.dimension.heightRange.max === data.block.location.y + 1 ? void 0 : data.block.above(1);
  if (above && above.isValid) FallingBlock.create({ fromBlock: { block: above } });
});
world.afterEvents.itemUse.subscribe((data) => {
  if (data.itemStack.typeId !== "minecraft:compass") return;
  FallingBlock.create({ custom: { block: "dirt", dimension: data.source.dimension, location: data.source.location } });
});
