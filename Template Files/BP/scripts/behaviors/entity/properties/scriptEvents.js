var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { system } from "@minecraft/server";
import { namespace } from "../../../data";
class EntityBehaviorScriptEvent {
  constructor() {
    __publicField(this, "entities", {});
  }
  initialize() {
    system.afterEvents.scriptEventReceive.subscribe((data) => {
      if (data.id !== `${namespace}:entity_event`) return;
      if (!data.sourceEntity || !data.sourceEntity.isValid) return;
      if (!this.entities[data.sourceEntity.typeId]) return;
      if (!this.entities[data.sourceEntity.typeId][data.message]) return;
      const entityData = this.entities[data.sourceEntity.typeId][data.message];
      if (entityData.callback) entityData.callback(data.sourceEntity);
    });
  }
}
export {
  EntityBehaviorScriptEvent
};
