import {Cell} from "@cells/Cell";
import {createSecurePair} from "tls";

export class Builder extends Cell {
  public static recipe = [WORK, CARRY, MOVE];
  public static roleName: string = 'builder';
  public static structures = [];

  public static build = (creep: Creep) => {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
    }
  };

  public static findStructuresToRepair = (creep: Creep): Structure[] => {
    const targets: Structure[] = creep.room.find(FIND_STRUCTURES, {
      filter: structure => structure.hits < structure.hitsMax
    });

    targets.sort((a: Structure,b: Structure) => a.hits - b.hits);

    return targets;
  };


  public static repair = (creep: Creep) => {
    const repairTarget = Builder.findStructuresToRepair(creep)[0];
    if(creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
      creep.moveTo(repairTarget);
    }
  };

  public static run = (creep: Creep) => {

    if(creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
    }

    if(creep.store.getUsedCapacity() === 0) {
      creep.memory.building = false;
    }

    const constructionAvailable = creep.room.find(FIND_CONSTRUCTION_SITES).length > 0;
    const shouldBuild = constructionAvailable && creep.memory.building;

    if (shouldBuild) {
      Builder.build(creep);
    } else {
      Builder.harvest(creep);
    }
  }
}
