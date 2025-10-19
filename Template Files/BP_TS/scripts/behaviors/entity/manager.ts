import { EntityBehaviorData } from "./data";
import { EntityBehaviorScriptEvent } from "./properties/scriptEvents";

export interface EntityBehaviorProperty {
    initialize: () => void,
    entities: { [id: string]: any; };
}

export interface EntityBehavior {
    [id: string | keyof EntityBehavior]: any;
}

export class EntityBehaviors {
    private static load(id: string, property: EntityBehaviorProperty) {
        let initialized = false;
        for (const entity in EntityBehaviorData) if (EntityBehaviorData[entity][id]) {
            property.entities[entity] = EntityBehaviorData[entity][id];
            initialized = true;
        }
        if (initialized) property.initialize();
    }
    static initialize() {
        this.load("scriptEvents", new EntityBehaviorScriptEvent)
    }
}