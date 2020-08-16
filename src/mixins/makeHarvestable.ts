import {Cell} from "@cells/Cell";

/**
 * Mixin that can accept a class that extends Moveable and adds methods for the ability to harvest
 * @param Base
 */
export function makeHarvestable<TBase extends Moveable>(Base: TBase) {
  return class extends Base {
    public harvest = (creep: Creep) => {
      let targetSource: Source;
      const sources = creep.room.find(FIND_SOURCES) as Source[];
      const hasCurrentTarget = !!creep.memory.sourceId;

      if(hasCurrentTarget) {
        targetSource = this.getCurrentTargetSource(creep, sources);
      } else {
        targetSource = this.findNewTargetSource(creep, sources);
        Memory.sourcesMap[targetSource.id] = Memory.sourcesMap[targetSource.id] + 1;
        creep.memory.sourceId = targetSource.id;
      }

      this.moveToHarvestSource(creep, targetSource);
    };

    public moveToHarvestSource (creep: Creep, source: Source){
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    };

    public endHarvest = (creep: Creep) => {
      if(creep.memory.sourceId) {
        const sourceValue = Memory.sourcesMap[creep.memory.sourceId];
        if(!(sourceValue <= 0)) {
          Memory.sourcesMap[creep.memory.sourceId] -= 1;
        }
        creep.memory.sourceId = '';
      }
    };
  }
}
