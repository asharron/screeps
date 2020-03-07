export abstract class Cell {
  public static recipe: BodyPartConstant[];
  public static roleName: string = '';
  public static run: (creep: Creep) => void;
}
