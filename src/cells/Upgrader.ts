import {Cell, CellRole} from "@cells/Cell";

export class Upgrader extends Cell {
  public static recipe = [WORK, CARRY, MOVE];
  public static roleName: CellRole = CellRole.Upgrader;
  public static structures = [];

  public static run = (creep: Creep) => {
    const doneUpgrading = creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0;

    if (doneUpgrading) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }

    const doneHarvesting = !creep.memory.upgrading && creep.store.getFreeCapacity() === 0;
    if (doneHarvesting) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
      Upgrader.endHarvest(creep);
    }

    const canUpgrade = creep.memory.upgrading && creep.room.controller;
    if (canUpgrade && creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    } else {
      Upgrader.harvest(creep);
    }
  }
}
