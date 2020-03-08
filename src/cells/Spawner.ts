import {Builder} from "@cells/Builder";
import {Cell} from "@cells/Cell";
import {Harvester} from "@cells/Harvester";
import {Upgrader} from "@cells/Upgrader";

export class Spawner {

  private static generateName = () => {
    Memory.populationId++;
    return `creep${Memory.populationId}`;
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
    const bodyParts: BodyPartConstant[] = role.recipe;
    const energyLevel = Game.spawns.Spawn1.store[RESOURCE_ENERGY];
    let totalCost = role.recipe.reduce((a: number, c: BodyPartConstant) => {
      return a + BODYPART_COST[c];
    }, 0);

    role.recipe.forEach((bodyPart: BodyPartConstant) => {
      if(energyLevel >= totalCost + BODYPART_COST[bodyPart]) {
        totalCost += BODYPART_COST[bodyPart];
        bodyParts.push(bodyPart);
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
      const name = Spawner.generateName();
      const role = Spawner.generateCellRole();
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
      Game.spawns.Spawn1.spawnCreep(body, name, spawnOptions);
    }
  };
}
