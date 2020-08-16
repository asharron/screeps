// example declaration file - remove these and add your own custom typings

// memory extension samples

interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
  building: boolean;
  upgrading: boolean;
  sourceId: string;
  structures: StructureConstant[];
  repairing: boolean;
  actionTarget: string;
}

// Helper type for composing mixin functions
type Constructor<T = {}> = new (...args: any[]) => T;
type Moveable = Constructor<{
  getCurrentTargetSource: (creep: Creep, sources: Source[]) => Source;
  findNewTargetSource: (creep: Creep, sources: Source[]) => Source;
  findFirstAvailableStructure: (creep: Creep) => Structure;
}>;
type Harvestable = Constructor<{
 harvest: (creep: Creep) => void;
 moveToHarvestSource: (creep: Creep, sources: Source) => void;
 endHarvest: (creep: Creep) => void;
 transferToTarget: (creep: Creep, target: Structure | Creep) => void;
}>

/**
 * Interface for keeping track of how many screeps are targeting a specific source
 */
interface SourcesMap {
  [sourceName: string]: number;
}

interface Memory {
  uuid: number;
  log: any;
  populationId: number;
  role: number;
  sourcesMap: SourcesMap;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
