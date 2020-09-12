/**
 * This is common functionality that each unique implementation of Cell can use to perform their specific task
 */
import {CellRole} from "@cells/Cell";

export class CellCore {
  public static recipe: BodyPartConstant[];
  public static roleName: CellRole = CellRole.Default;
  public static run: (creep: Creep) => void;
  public static structures: StructureConstant[];

  public static getCurrentTargetSource = (creep: Creep, sources: Source[]): Source => {
    const currentTarget = sources.find((source: Source) => {
      return source.id === creep.memory.sourceId;
    });

    return currentTarget || sources[0];
  };

  public static findNewTargetSource = (creep: Creep, sources: Source[]): Source => {
    const targetSource = sources.reduce((prevSource: Source, nextSource: Source) => {
      const prevValue = Memory.sourcesMap[prevSource.id];
      const nextValue = Memory.sourcesMap[nextSource.id];
      if(nextValue < prevValue) {
        return nextSource;
      } else {
        return prevSource;
      }
    });

    return targetSource || sources[0];
  };

  /**
   * Harvests a source if the creep is near it, otherwise move to the source
   * @param creep
   * @param source
   */
  public static moveToAndHarvestSource = (creep: Creep, source: Source) => {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  };

  /**
   * Will move the creep to a harvest source and harvest from it
   * @param creep
   */
  public static harvest = (creep: Creep) => {
    let targetSource: Source;
    const sources = creep.room.find(FIND_SOURCES) as Source[];
    const hasCurrentTarget = !!creep.memory.sourceId;

    if(hasCurrentTarget) {
      targetSource = CellCore.getCurrentTargetSource(creep, sources);
    } else {
      targetSource = CellCore.findNewTargetSource(creep, sources);
      Memory.sourcesMap[targetSource.id] = Memory.sourcesMap[targetSource.id] + 1;
      creep.memory.sourceId = targetSource.id;
    }

    CellCore.moveToAndHarvestSource(creep, targetSource);
  };

  public static endHarvest = (creep: Creep) => {
    if(creep.memory.sourceId) {
      const sourceValue = Memory.sourcesMap[creep.memory.sourceId];
      if(!(sourceValue <= 0)) {
        Memory.sourcesMap[creep.memory.sourceId] -= 1;
      }
      creep.memory.sourceId = '';
    }
  };

  public static transferToTarget = (creep: Creep, target: Structure | Creep) => {
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
  };

  /**
   * Finds the first structure that has free capacity for resource energy
   * @param creep
   */
  public static findFirstAvailableStructure = (creep: Creep): Structure  => {
    // TODO: Simplify filtering logic
    const targets = creep.room.find(FIND_MY_STRUCTURES, {
      filter: (structure: Structure) => {
        return creep.memory.structures.includes(structure.structureType);
      }
    });

    const freeCapacityTargets =  targets.filter((structure: Structure) => {
      const struct = structure as AnyStoreStructure;
      return struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    });

    return freeCapacityTargets[0];
  };
}
