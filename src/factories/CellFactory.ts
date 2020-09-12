import {CellRole} from "@cells/Cell";
import {Builder} from "@cells/Builder";
import {Harvester} from "@cells/Harvester";
import {Upgrader} from "@cells/Upgrader";

export class CellFactory {
  public static getCellRecipe = (cellRole: CellRole) => {
    switch(cellRole) {
      case CellRole.Builder:
        return Builder.recipe;
      case CellRole.Harvester:
        return Harvester.recipe;
      case CellRole.Upgrader:
        return Upgrader.recipe;
      default:
        return Upgrader.recipe;
    }
  }

  public static getCellStructures = (cellRole: CellRole)  => {
    switch(cellRole) {
      case CellRole.Builder:
        return Builder.structures;
      case CellRole.Harvester:
        return Harvester.structures;
      case CellRole.Upgrader:
        return Upgrader.structures;
      default:
        return Upgrader.structures;
    }
  }
}
