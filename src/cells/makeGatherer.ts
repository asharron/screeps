import {Harvester} from "@cells/Harvester";

export function makeGatherer<TBase extends Harvestable>(Base: TBase) {
  return class extends Base {
    public run = (creep: Creep) => {
      if (creep.store.getFreeCapacity() > 0) {
        this.harvest(creep);
      } else {
        this.endHarvest(creep);
        const transferTarget = this.findFirstAvailableStructure(creep);
        Harvester.transferToTarget(creep, transferTarget);
      }
    }
  }
}
