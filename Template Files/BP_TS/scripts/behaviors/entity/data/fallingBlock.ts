import { Block, BlockInventoryComponent, Dimension, Entity, ItemStack, StructureSaveMode, system, Vector3, world } from "@minecraft/server";
import { EntityBehavior } from "../manager";
import { spawnItem } from "../../../utils/item";
import { getBlock } from "../../../utils/block";
import { spawnEntity } from "../../../utils/entity";
import { namespace } from "../../../data";

interface fallingBlockConstructorOptions {
    custom?: {
        dimension: Dimension,
        location: Vector3,
        block: string,
        structure?: string,
        rotating?: boolean
    },
    fromBlock?: {
        block: Block,
        rotating?: boolean
    }
}

export class FallingBlock {
    static behavior: EntityBehavior = {
        scriptEvents: {
            "turn_to_block": {
                callback: (entity) => {
                    system.runTimeout(() => {
                        if (!entity || !entity.isValid || !entity.isOnGround) return
                        const dimension = entity.dimension
                        const blockId = entity.getDynamicProperty("block") as string | undefined
                        const location = { x: entity.location.x, y: entity.location.y + 0.2, z: entity.location.z }
                        const structure = entity.getDynamicProperty("structure") as string | undefined
                        entity.remove()
                        if (!blockId) return
                        function dropBlock() {
                            if (!blockId) return
                            try { spawnItem(new ItemStack(blockId, 1), dimension, location, true) } catch { }
                        }
                        const block = getBlock(dimension, location)
                        if (!block || !block.isValid) {
                            dropBlock()
                            return
                        }
                        const tags = block.getTags()
                        if (structure) {
                            const loadedStructure = world.structureManager.get(structure)
                            if (loadedStructure) {
                                world.structureManager.place(loadedStructure, dimension, location)
                                world.structureManager.delete(loadedStructure)
                                return
                            }
                        }
                        const complexBlockConditions: {[id: string]: (block: Block) => boolean} = {
                            "minecraft:snow_layer": (block) => {
                                return block.permutation.getState("height") === 0
                            }
                        }
                        if (!block.isLiquid && (complexBlockConditions[block.typeId] ? !complexBlockConditions[block.typeId](block) : true) && (tags.find((f) => f.startsWith("minecraft:") && f.endsWith("item_destructible")) || (tags.includes("plant") && !block.typeId.includes("grass")) || tags.includes("fertilize_area"))) {
                            dropBlock()
                            return
                        }
                        if (!block.isLiquid) block.dimension.runCommand(`setblock ${block.location.x} ${block.location.y} ${block.location.z} air destroy`)
                        block.setType(blockId)
                    }, 5)
                }
            },
            "remove": {
                callback: (entity) => {
                    entity.remove()
                }
            }
        }
    }
    static create(options: fallingBlockConstructorOptions): Entity | undefined {
        if (options.custom) {
            const { block, dimension, location, rotating, structure } = options.custom
            const entity = spawnEntity(`${namespace}:falling_block`, dimension, location)
            const structureId = structure?.replaceAll("entity_id", entity.id)
            entity.setDynamicProperty("block", block)
            if (structureId) entity.setDynamicProperty("structure", structureId)
            try { entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${block}`) } catch { }
            if (rotating) entity.setProperty(`${namespace}:rotating`, rotating)
            return entity
        } else if (options.fromBlock) {
            const {block, rotating} = options.fromBlock
            if (!block.isValid || block.isLiquid || block.isAir) return undefined
            const center = block.center()
            const loc = {x: center.x, y: block.location.y, z: center.z}
            const entity = spawnEntity(`${namespace}:falling_block`, block.dimension, loc)
            const typeId = block.typeId
            const inv = block.getComponent(BlockInventoryComponent.componentId)?.container
            const isComplex = inv !== undefined || Object.entries(block.permutation.getAllStates()).length > 0
            if (isComplex) {
                world.structureManager.createFromWorld(
                    `${namespace}:falling_block.${entity.id}`, 
                    block.dimension, 
                    block.location, 
                    block.location, 
                    {includeBlocks: true, includeEntities: false, saveMode: StructureSaveMode.World}
                )
                inv?.clearAll()
            }
            block.setType("air")
            try { entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${typeId}`) } catch { }
            entity.setDynamicProperty("block", typeId)
            if (rotating) entity.setProperty(`${namespace}:rotating`, rotating)
            if (isComplex) {entity.setDynamicProperty("structure", `${namespace}:falling_block.${entity.id}`)}
            return entity
        } else return undefined
    }
}