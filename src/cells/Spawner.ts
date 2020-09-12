import {CellRole} from "@cells/Cell";
import {CellFactory} from "../factories/CellFactory";
import names from "../resources/names";

export class Spawner {

  /**
   * Generates a name for a newly spawned cell.
   * Uses the role name and a random first name
   * @param cellRole
   */
  private static generateName = (cellRole: CellRole) => {
    let cellName = names.firstNames[Math.floor(Math.random() * names.firstNames.length)]
    let idx = 0;
    while(!!Game.creeps[cellName + idx]) {
      idx++;
    }
    cellName += idx.toString();
    return `${cellRole}#${cellName}`;
  };

  private static incrementPopulationId = () => {
    Memory.populationId++;
  }

  private static cycleToNextRole = () => {
    Memory.role = (Memory.role + 1) % 3;
  }

  public static generateCellRole = (): CellRole => {
    if (!Memory.role) {
      Memory.role = 0;
    }

    switch (Memory.role) {
      case 0:
        return CellRole.Harvester;
      case 1:
        return CellRole.Builder;
      case 2:
        return CellRole.Upgrader;
      default:
        return CellRole.Upgrader;
    }
  };

  public static createBodyFromRole = (role: CellRole): BodyPartConstant[] => {
    const bodyParts: BodyPartConstant[] = [...CellFactory.getCellRecipe(role)];

    // const extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
    //   filter: {
    //     structureType: STRUCTURE_EXTENSION
    //   }
    // });
    //
    // const activeExtensions = extensions.filter((extension) => {
    //   return extension.isActive();
    // });
    // let budget = activeExtensions.reduce((a: number, b) => {
    //   if("store" in b) {
    //     // @ts-ignore
    //     return a + b.store.getUsedCapacity(RESOURCE_ENERGY);
    //   } else {
    //     return 0;
    //   }
    // }, 0);
    //
    // // TODO: Make readable
    // while(budget >= 50) {
    //   role.recipe.forEach((bodyPart: BodyPartConstant) => {
    //     const partCost = BODYPART_COST[bodyPart];
    //     if (budget >= partCost) {
    //       budget = (budget - partCost);
    //       bodyParts.push(bodyPart);
    //     }
    //   });
    // }

    return bodyParts;
  };

  public static createStructuresToControl = (cellRole: CellRole) => {
    return CellFactory.getCellStructures(cellRole);
  };

  /**
   * Clear dead screeps from showing up in local Memory
   */
  public static deallocateScreeps = () => {
    if (!Memory.creeps) {
      return;
    }
    Object.keys(Memory.creeps)
      .filter((creepName) => (!Game.creeps[creepName]))
      .map((deadCreepName) => (delete Memory.creeps[deadCreepName]));
  };

  public static controlSpawn = () => {
    const numScreeps = Object.keys(Game.creeps).length;
    const minScreeps = 10;
    Spawner.deallocateScreeps();
    const role = Spawner.generateCellRole();
    const name = Spawner.generateName(role);
    const body = Spawner.createBodyFromRole(role);
    const canSpawn = !Game.spawns.Spawn1.spawnCreep(body,
      name, { dryRun: true });

    if (canSpawn && numScreeps < minScreeps) {
      console.log("Generating creep with role: ", role);
      console.log("Body: ", body);
      const structures = Spawner.createStructuresToControl(role);
      console.log("Structures: ", structures);
      const creepMemory: CreepMemory = {
        actionTarget: "",
        building: false,
        repairing: false,
        role,
        room: '',
        sourceId: '',
        structures,
        upgrading: false,
        working: false
      };
      const spawnOptions: SpawnOptions = {
        memory: creepMemory
      };
      if(Game.spawns.Spawn1.spawnCreep(body, name, spawnOptions) !== 0) {
        console.log("Spawn Failed!!!");
      } else {
        Spawner.cycleToNextRole();
        Spawner.incrementPopulationId();
      }
    }
  };
}
