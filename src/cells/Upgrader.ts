import {Cell, CellRole} from '@cells/Cell';
import {CellCore} from '@cells/CellCore';

export class Upgrader implements Cell {
  public static recipe = [WORK, CARRY, MOVE];
  public roleName: CellRole = CellRole.Upgrader;
  public static structures = [];
  private readonly creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
  }

  public run = () => {
    const doneUpgrading = this.creep.memory.upgrading && this.creep.store[RESOURCE_ENERGY] === 0;

    if (doneUpgrading) {
      this.creep.memory.upgrading = false;
      this.creep.say('🔄 harvest');
    }

    const doneHarvesting = !this.creep.memory.upgrading && this.creep.store.getFreeCapacity() === 0;
    if (doneHarvesting) {
      this.creep.memory.upgrading = true;
      this.creep.say('⚡ upgrade');
      CellCore.endHarvest(this.creep);
    }

    const canUpgrade = this.creep.memory.upgrading && this.creep.room.controller;
    if (canUpgrade && this.creep.room.controller) {
      if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    } else {
      CellCore.harvest(this.creep);
    }
  }
}
