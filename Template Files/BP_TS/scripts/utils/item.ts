import { Dimension, Entity, ItemStack, Vector3 } from "@minecraft/server"
import { randomNum } from "./math"

export function spawnItem(item: ItemStack, dimension: Dimension, location: Vector3, randomVelocity?: boolean): Entity {
    const itemEntity = dimension.spawnItem(item, {x: location.x, y: 100, z: location.z})
    itemEntity.teleport(location)
    if (randomVelocity) itemEntity.applyImpulse({x: randomNum(-0.1, 0.1), y: randomNum(0.05, 0.15), z: randomNum(-0.1, 0.1)})
    return itemEntity
}