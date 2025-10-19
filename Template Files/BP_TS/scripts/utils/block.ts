import { Block, Dimension, Vector3 } from "@minecraft/server";

export function getBlock(dimension: Dimension, location: Vector3): Block | undefined {
    let block: Block | undefined = undefined
    try {block = dimension.getBlock(location)} catch {}
    return block
}