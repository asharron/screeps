// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
  building: boolean;
  upgrading: boolean;
  sourceId: string;
}

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
