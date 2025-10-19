import { Entity, system } from "@minecraft/server";
import { EntityBehaviorProperty } from "../manager";
import { namespace } from "../../../data";

declare module "../manager" {
    interface EntityBehavior{
        scriptEvents?: EntityBehaviorScriptEventData
    }
}

export interface EntityBehaviorScriptEventData{
    [id: string]: {
        callback?: (entity: Entity) => void
    }
}

export class EntityBehaviorScriptEvent implements EntityBehaviorProperty{
    entities: {[id: string]: EntityBehaviorScriptEventData} = {}
    initialize() {
        system.afterEvents.scriptEventReceive.subscribe((data) => {
            if (data.id !== `${namespace}:entity_event`) return
            if (!data.sourceEntity || !data.sourceEntity.isValid) return
            if (!this.entities[data.sourceEntity.typeId]) return
            if (!this.entities[data.sourceEntity.typeId][data.message]) return
            const entityData = this.entities[data.sourceEntity.typeId][data.message]
            if (entityData.callback) entityData.callback(data.sourceEntity)
        })
    }
}