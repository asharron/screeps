export enum CellRole {
  Harvester='harvester',
  Builder='builder',
  Upgrader='upgrader',
  Default='default'
}

export interface Cell {
  roleName: CellRole;
  run (creep: Creep): void;
}
