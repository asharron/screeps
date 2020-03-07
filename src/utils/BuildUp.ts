export class BuildUp {

  public static initSourcesMap = () => {
    Memory.sourcesMap = Memory.sourcesMap || {};

    for(const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const sources = room.find(FIND_SOURCES) as Source[];
      sources.forEach((source) => {
        Memory.sourcesMap[source.id] =  Memory.sourcesMap[source.id] || 0;
      });
    }
  };

  public static initVariables = () => {
    BuildUp.initSourcesMap();
  }
}
