import { Builder } from '@cells/Builder';
import { Harvester } from '@cells/Harvester';
import { Spawner } from '@cells/Spawner';
import { Upgrader } from '@cells/Upgrader';
import { BuildUp} from "@utils/BuildUp";
import { ErrorMapper } from '@utils/ErrorMapper';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  BuildUp.initVariables();
  const tower = Game.getObjectById('TOWER_ID') as StructureTower;
  if(tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
    });
    if(closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    }
  }

  for(const name in Game.creeps) {
    const creep = Game.creeps[name];
    if(creep.memory.role === 'harvester') {
      Harvester.run(creep);
    }
    if(creep.memory.role === 'builder') {
      Builder.run(creep);
    }
    if(creep.memory.role === 'upgrader') {
      Upgrader.run(creep);
    }
  }
  Spawner.controlSpawn();
});
