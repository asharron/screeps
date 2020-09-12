import {Cell, CellRole} from "@cells/Cell";
import {CellCore} from "@cells/CellCore";

export class Builder implements Cell {
  public static recipe = [WORK, CARRY, MOVE];
  public roleName: CellRole = CellRole.Builder;
  public static structures = [];
  private readonly creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
  }

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

    return structures.filter((type: StructureConstant) => {
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
  };

  public static canCreateConstructionSite = (creep: Creep) => {
    if(creep.room.controller) {
      const squareIsEmpty = creep.room.lookAt(creep.pos.x + 1, creep.pos.y).length === 1;
      const availableStructures = Builder.findStructuresToCreate(creep);
      return squareIsEmpty && availableStructures.length > 0;
    }

    return false;
  };

  public run = () => {
    if(Builder.canCreateConstructionSite(this.creep)) {
      Builder.createConstructionSite(this.creep);
    }

    const constructionAvailable = this.creep.room.find(FIND_CONSTRUCTION_SITES).length > 0;
    if(this.creep.store.getFreeCapacity() === 0 && constructionAvailable) {
      this.creep.memory.building = true;
    }

    const repairingAvailable = Builder.findStructuresToRepair(this.creep).length > 0;
    if(this.creep.store.getFreeCapacity() === 0 && repairingAvailable && !this.creep.memory.building) {
      this.creep.memory.repairing = true;
    }

    if(this.creep.store.getUsedCapacity() === 0) {
      this.creep.memory.building = false;
      this.creep.memory.repairing = false;
      this.creep.memory.actionTarget = "";
    }

    if (this.creep.memory.building) {
      Builder.build(this.creep);
    } else if(this.creep.memory.repairing) {
      Builder.repair(this.creep);
    } else {
      CellCore.harvest(this.creep);
    }
  }
}
