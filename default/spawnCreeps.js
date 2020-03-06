const generateName = () => {
    Memory.populationId++;
    return `creep${Memory.populationId}`;
};

const generateRole = () => {
    if(!Memory.role) {
        Memory.role = 0;
    }

    Memory.role = (Memory.role + 1) % 3;
    console.log("Generating creep with role: ", Memory.role);
    switch(Memory.role) {
        case 0:
            return 'harvester';
        case 1:
            return 'builder';
        case 2:
            return 'upgrader';
    }
};

const generateBody = () => {
    const energyLevel = Game.spawns['Spawn1'].store[RESOURCE_ENERGY];

};

module.exports = () => {
    const numScreeps = Object.keys(Game.creeps).length;
    const minScreeps = 5;

    const body = [WORK, CARRY, MOVE];

    if(numScreeps < minScreeps) {
        const name = generateName();
        const role = generateRole();
        Game.spawns['Spawn1'].spawnCreep(body, name, {     memory: {role: role} });
    }
};