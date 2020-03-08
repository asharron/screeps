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
      const transferTarget = Harvester.findFirstAvailableStructure(creep);
      console.log("Transfer target!: ", transferTarget);
      Harvester.transferToTarget(creep, transferTarget);
    }
  }
}
