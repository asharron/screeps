import {Cell} from '@cells/Cell';

export class Harvester extends Cell {
  public static recipe: BodyPartConstant[] = [WORK, CARRY, MOVE];
  public static roleName: string = 'harvester';
  public static structures = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_CONTAINER];

  public static run = (creep: Creep): void => {
    if (creep.store.getFreeCapacity() > 0) {
      Harvester.harvest(creep);
    } else {
      Harvester.endHarvest(creep);
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (targets.length > 0) {
        Harvester.transferToTarget(creep, targets[0]);
      }
    }
  }
}
