import { Dimension, Entity, Vector3 } from "@minecraft/server";

export function spawnEntity(id: string, dimension: Dimension, location: Vector3): Entity {
    const entity = dimension.spawnEntity(id, {x: location.x, y: 100, z: location.z})
    if (entity) entity.teleport(location)
    return entity
}