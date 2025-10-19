import { EntityBehaviorData } from "./data";
import { EntityBehaviorScriptEvent } from "./properties/scriptEvents";
class EntityBehaviors {
  static load(id, property) {
    let initialized = false;
    for (const entity in EntityBehaviorData) if (EntityBehaviorData[entity][id]) {
      property.entities[entity] = EntityBehaviorData[entity][id];
      initialized = true;
    }
    if (initialized) property.initialize();
  }
  static initialize() {
    this.load("scriptEvents", new EntityBehaviorScriptEvent());
  }
}
export {
  EntityBehaviors
};
