import {CellUtils} from '@utils/CellUtils';

interface RoleTable {
  [key: string]: number;
}

export class PopulationDash {

  public static calculateCurrentPopulation = (): number => {
    return Object.keys(Game.creeps).length;
  }

  public static calculateRoleTable = () => {
    const roles: RoleTable = {};
    CellUtils.getGameCreeps().forEach((creep) => {
      const cellRole: string = creep.memory.role;
      if(!!roles[cellRole]) {
        roles[cellRole] += 1;
      } else {
        roles[cellRole] = 1;
      }
    });
    return roles;
  }

  public static formatRoleTable = () => {
    const roles = PopulationDash.calculateRoleTable();
    let formattedTable = '';
    for(const roleName in roles) {
      formattedTable += `${roleName}: ${roles[roleName]}|`;
    }
    return formattedTable.substring(0, formattedTable.length - 1);
  }

  public static renderRolePopulationTable = (roomVisual: RoomVisual): void => {
    PopulationDash.formatRoleTable()
      .split('|')
      .forEach((row, idx) => {
        roomVisual.text(`${row}`, 5, 2 + idx, {color: '#000000', font: '1'});
      });
  }

  public static renderDash = (): void => {
   const roomVisual = Game.spawns.Spawn1.room.visual;
   roomVisual.rect(0, 0, 10, 10);
   roomVisual.text(`Total Population: ${PopulationDash.calculateCurrentPopulation()}`, 5, 1, {color: '#000000', font: '1'});
   PopulationDash.renderRolePopulationTable(roomVisual);
  }
}
