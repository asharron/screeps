import {Cell} from "@cells/Cell";

export class Upgrader extends Cell {
  public static recipe = [WORK, CARRY, MOVE];
  public static roleName: string = 'upgrader';

  public static harvest(creep: Creep) {
    if (!Memory.sourcesMap) {
      Memory.sourcesMap = {};
    }
    const sources = creep.room.find(FIND_SOURCES) as Source[];
    let targetSource = sources[0];

    if(creep.memory.sourceId) {
      const creepSource = sources.find((source: Source) => {
        return source.id === creep.memory.sourceId;
      });

      if(creepSource) {
        targetSource = creepSource;
      }
    }

    if(!creep.memory.sourceId) {
      sources.forEach((source) => {
        const sourceId = source.id;

        if (!Memory.sourcesMap[sourceId]) {
          Memory.sourcesMap[sourceId] = 0;
        }

        if (Memory.sourcesMap[sourceId] < Memory.sourcesMap[targetSource.id]) {
          targetSource = source;
        }

      });

      Memory.sourcesMap[targetSource.id] += 1;
    }

    creep.memory.sourceId = targetSource.id;

    if (creep.harvest(targetSource) === ERR_NOT_IN_RANGE) {
      creep.moveTo(targetSource, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  }

  public static run = (creep: Creep) => {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
      if(!Memory.sourcesMap[creep.memory.sourceId]) {
        Memory.sourcesMap[creep.memory.sourceId] = 1;
      }
      Memory.sourcesMap[creep.memory.sourceId] -= 1;
    }

    if (creep.memory.upgrading && creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    } else {
      Upgrader.harvest(creep);
    }
  }
}
