import {Builder} from '@cells/Builder';
import {CellRole} from "@cells/Cell";
import {Harvester} from '@cells/Harvester';
import {Spawner} from '@cells/Spawner';
import {Upgrader} from '@cells/Upgrader';
import {BuildUp} from "@utils/BuildUp";
import {ErrorMapper} from '@utils/ErrorMapper';
import {PopulationDash} from '@ui/PopulationDash';

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
    switch(creep.memory.role) {
      case CellRole.Harvester:
        Harvester.run(creep);
        break;
      case CellRole.Builder:
        Builder.run(creep);
        break;
      case CellRole.Upgrader:
        Upgrader.run(creep);
        break;
      default:
        creep.suicide();
    }
  }
  Spawner.controlSpawn();
  PopulationDash.renderDash();
});
