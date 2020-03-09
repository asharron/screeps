import {Builder} from "@cells/Builder";
import {Cell} from "@cells/Cell";
import {Harvester} from "@cells/Harvester";
import {Upgrader} from "@cells/Upgrader";

export class Spawner {

  private static generateName = (cell: typeof Cell) => {
    Memory.populationId++;
    return `${cell.roleName}#${Memory.populationId}`;
  };

  public static generateCellRole = (): typeof Cell => {
    if (!Memory.role) {
      Memory.role = 0;
    }

    Memory.role = (Memory.role + 1) % 3;
    switch (Memory.role) {
      case 0:
        return Harvester;
      case 1:
        return Builder;
      case 2:
        return Upgrader;
      default:
        return Upgrader;
    }
  };

  public static createBodyFromRole = (role: typeof Cell): BodyPartConstant[] => {
    const bodyParts: BodyPartConstant[] = [...role.recipe];

    const extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_EXTENSION
      }
    });

    const activeExtensions = extensions.filter((extension) => {
      return extension.isActive();
    });
    let budget = activeExtensions.reduce((a: number, b) => {
      if("store" in b) {
        // @ts-ignore
        return a + b.store.getUsedCapacity(RESOURCE_ENERGY);
      } else {
        return 0;
      }
    }, 0);

    // TODO: Make readable
    role.recipe.forEach((bodyPart: BodyPartConstant) => {
      const partCost = BODYPART_COST[bodyPart];
      if(budget > partCost) {
        console.log("body parst", bodyParts);
        budget = (budget - partCost);
      }
    });

    return bodyParts;
  };

  public static createStructuresToControl = (cell: typeof Cell) => {
    return cell.structures;
  };

  public static deallocateSCreeps = () => {
    const deadCreeps = Object.keys(Memory.creeps).filter((creepName) => {
      return !Game.creeps[creepName];
    });

    deadCreeps.forEach((deadCreepName) => {
      delete Memory.creeps[deadCreepName];
    })
  };

  public static controlSpawn = () => {
    const numScreeps = Object.keys(Game.creeps).length;
    const minScreeps = 10;
    Spawner.deallocateSCreeps();
    const canSpawn = !Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE],
      'WorkerXX', { dryRun: true });

    if (canSpawn && numScreeps < minScreeps) {
      const role = Spawner.generateCellRole();
      const name = Spawner.generateName(role);
      console.log("Generating creep with role: ", role.roleName);
      const body = Spawner.createBodyFromRole(role);
      console.log("Body: ", body);
      const structures = Spawner.createStructuresToControl(role);
      console.log("Structures: ", structures);
      const creepMemory: CreepMemory = {
        building: false,
        repairing: false,
        role: role.roleName,
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
      }
    }
  };
}
