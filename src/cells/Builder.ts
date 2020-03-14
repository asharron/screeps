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

  /**
   * Sees if the creep as a actionTarget for repairing and continues to repair that target if so
   * Otherwise find and set a target for the creep to remember
   * @param creep
   */
  public static findOrRememberRepairTarget(creep: Creep) {
    const repairTargets = Builder.findStructuresToRepair(creep);

    if(!creep.memory.actionTarget) {
     creep.memory.actionTarget = repairTargets[0].id;
     return repairTargets[0];
    } else {
      return repairTargets.find(t => t.id === creep.memory.actionTarget) || repairTargets[0];
    }
  }

  public static repair = (creep: Creep) => {
    const repairTarget = Builder.findOrRememberRepairTarget(creep);

    if(creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
      creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ffffff'}});
    }
  };

  public static createConstructionSite = (creep: Creep) => {
    const availableStructures = Builder.findStructuresToCreate(creep);
    const structureToCreate = availableStructures[0];
    // @ts-ignore
    creep.room.createConstructionSite(creep.pos.x + 1, creep.pos.y, structureToCreate);
  };

  public static findStructuresToCreate = (creep: Creep) => {
    const allowedStructures: StructureConstant[] = [STRUCTURE_EXTENSION, STRUCTURE_CONTAINER];
    return Builder.filterForAvailableStructures(allowedStructures, creep);
  };

  public static filterForAvailableStructures = (structures: StructureConstant[], creep: Creep) => {
    const extensions = creep.room.find(FIND_MY_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_EXTENSION
      }
    });
    const containers = creep.room.find(FIND_MY_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_CONTAINER
      }
    });

    const fil = structures.filter((type: StructureConstant) => {
      if(!creep.room.controller) {
        return;
      }
      switch (type) {
        case STRUCTURE_EXTENSION:
          const maxNumExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][creep.room.controller.level];
          return extensions.length < maxNumExtensions;
        case STRUCTURE_CONTAINER:
          const maxNumContainers = CONTROLLER_STRUCTURES[STRUCTURE_CONTAINER][creep.room.controller.level];
          return containers.length < maxNumContainers;
        default:
          return false;
      }
    });
    return fil;
  };

  public static canCreateConstructionSite = (creep: Creep) => {
    if(creep.room.controller) {
      const squareIsEmpty = creep.room.lookAt(creep.pos.x + 1, creep.pos.y).length === 1;
      const availableStructures = Builder.findStructuresToCreate(creep);
      return squareIsEmpty && availableStructures.length > 0;
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
    if(creep.store.getFreeCapacity() === 0 && repairingAvailable && !creep.memory.building) {
      creep.memory.repairing = true;
    }

    if(creep.store.getUsedCapacity() === 0) {
      creep.memory.building = false;
      creep.memory.repairing = false;
      creep.memory.actionTarget = "";
    }

    if (creep.memory.building) {
      Builder.build(creep);
    } else if(creep.memory.repairing) {
      Builder.repair(creep);
    } else {
      Builder.harvest(creep);
    }
  }
}
