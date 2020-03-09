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

  public static createConstructionSite = (creep: Creep) => {
    creep.room.createConstructionSite(creep.pos.x + 1, creep.pos.y, STRUCTURE_EXTENSION);
  };

  public static canCreateConstructionSite = (creep: Creep) => {
    if(creep.room.controller) {
      const squareIsEmpty = creep.room.lookAt(creep.pos.x + 1, creep.pos.y).length === 1;
      const maxNumExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][creep.room.controller.level];
      const extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
        filter: {
          structureType: STRUCTURE_EXTENSION
        }
      });
      return extensions.length < maxNumExtensions && squareIsEmpty;
    }

    return false;
  };

  public static run = (creep: Creep) => {
    if(Builder.canCreateConstructionSite(creep)) {
      Builder.createConstructionSite(creep);
    }

    const constructionAvailable = creep.room.find(FIND_CONSTRUCTION_SITES).length > 0;
    if(creep.store.getFreeCapacity() === 0 && constructionAvailable) {
      creep.memory.building = true;
    }

    const repairingAvailable = Builder.findStructuresToRepair(creep).length > 0;
    if(creep.store.getFreeCapacity() === 0 && repairingAvailable) {
      creep.memory.repairing = true;
    }

    if(creep.store.getUsedCapacity() === 0) {
      creep.memory.building = false;
      creep.memory.repairing = false;
    }

    if (creep.memory.building) {
      Builder.build(creep);
    } else if(creep.memory.repairing) {
      console.log("Reparing!");
      Builder.repair(creep);
    } else {
      Builder.harvest(creep);
    }
  }
}
