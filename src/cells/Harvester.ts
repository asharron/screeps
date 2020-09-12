import {Cell, CellRole} from '@cells/Cell';
import {CellCore} from '@cells/CellCore';

/**
 * Harvester cell for transporting energy to spawn and containers
 */
export class Harvester implements Cell {
  public static recipe: BodyPartConstant[] = [WORK, CARRY, MOVE];
  public roleName: CellRole = CellRole.Harvester;
  public static structures = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_CONTAINER];
  private readonly creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
  }

  /**
   * Harvests if it has free capacity and transfers the resources to first vailable structure it finds
   * @param creep
   */
  public run = (): void => {
    if (this.creep.store.getFreeCapacity() > 0) {
      CellCore.harvest(this.creep);
    } else {
      CellCore.endHarvest(this.creep);
      const transferTarget = CellCore.findFirstAvailableStructure(this.creep);
      CellCore.transferToTarget(this.creep, transferTarget);
    }
  }
}
