import {Cell} from "@cells/Cell";

export class Builder extends Cell {
  public static recipe = [WORK, CARRY, MOVE];
  public static roleName: string = 'builder';
  public static structures = [];

  public static run = (creep: Creep) => {

    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
      creep.say('🚧 build');
      Builder.endHarvest(creep);
    }

    if (creep.memory.building) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    } else {
      Builder.harvest(creep);
    }
  }
}
