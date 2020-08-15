export enum CellRole {
  Harvester='harvester',
  Builder='builder',
  Upgrader='upgrader',
  Default='default'
}

export abstract class Cell {
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

  public static moveToHarvestSource = (creep: Creep, source: Source) => {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  };

  public static harvest = (creep: Creep) => {
    let targetSource: Source;
    const sources = creep.room.find(FIND_SOURCES) as Source[];
    const hasCurrentTarget = !!creep.memory.sourceId;

    if(hasCurrentTarget) {
      targetSource = Cell.getCurrentTargetSource(creep, sources);
    } else {
      targetSource = Cell.findNewTargetSource(creep, sources);
      Memory.sourcesMap[targetSource.id] = Memory.sourcesMap[targetSource.id] + 1;
      creep.memory.sourceId = targetSource.id;
    }

    Cell.moveToHarvestSource(creep, targetSource);
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

  // TODO: Simplify filtering logic
  public static findFirstAvailableStructure = (creep: Creep): Structure  => {
    const targets = creep.room.find(FIND_MY_STRUCTURES, {
      filter: (structure: Structure) => {
        return creep.memory.structures.includes(structure.structureType);
      }
    });

    const allTargets =  targets.filter((structure: Structure) => {
      const struct = structure as AnyStoreStructure;
      if(struct.store) {
        return struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      } else {
        return true;
      }
    });

    return allTargets[0];
  };
}
