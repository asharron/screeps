export class CellUtils {
  public static getGameCreeps = (): Creep[] => {
    return Object.keys(Game.creeps).map(creepName => Game.creeps[creepName]);
  }
}
