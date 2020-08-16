export function makeMovable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
    }

    public getCurrentTargetSource = (creep: Creep, sources: Source[]): Source => {
      const currentTarget = sources.find((source: Source) => {
        return source.id === creep.memory.sourceId;
      });

      return currentTarget || sources[0];
    };

    public findNewTargetSource = (creep: Creep, sources: Source[]): Source => {
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

    public findFirstAvailableStructure = (creep: Creep): Structure  => {
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

    public transferToTarget = (creep: Creep, target: Structure | Creep) => {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    };
  }
}
