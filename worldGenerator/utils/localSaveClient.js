const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'regions.json');

let store = { regions: {}, worlds: {} };

const loadFromDisk = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const raw = await fs.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        // Migration: old format was a flat { regionId: regionJson } object
        if (parsed.regions !== undefined || parsed.worlds !== undefined) {
            store = parsed;
            store.regions = store.regions || {};
            store.worlds = store.worlds || {};
        } else {
            store = { regions: parsed, worlds: {} };
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.warn(`Could not load data file, starting fresh: ${err.message}`);
        }
        store = { regions: {}, worlds: {} };
    }
};

const persistToDisk = (() => {
    let writeQueue = Promise.resolve();
    return () => {
        writeQueue = writeQueue.then(() =>
            fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8')
        );
        return writeQueue;
    };
})();

const ready = loadFromDisk();

module.exports = {
    ready,
    async closeConnection() {
        // No connection to close for file-based storage
    },

    async getRegion(regionId) {
        if (!regionId || !regionId.length) {
            throw new Error('RegionId is required to getRegion');
        }
        return store.regions[regionId];
    },

    getAllRegions() {
        return Object.values(store.regions);
    },

    async saveRegion(region) {
        const regionJson = region.toJson();
        store.regions[regionJson.id] = regionJson;
        await persistToDisk();
    },

    async getWorld(worldId) {
        if (!worldId || !worldId.length) {
            throw new Error('WorldId is required to getWorld');
        }
        return store.worlds[worldId];
    },

    getAllWorlds() {
        return Object.values(store.worlds);
    },

    async saveWorld(world) {
        const worldJson = world.toJson();
        store.worlds[worldJson.id] = worldJson;
        await persistToDisk();
    },

    async getBlock(blockId) {
        if (!blockId || !blockId.length) {
            throw new Error('BlockId is required to getBlock');
        }
        // regionId is everything before the last segment (e.g. "earth.top.0" → "earth.top")
        const regionId = blockId.split('.').slice(0, -1).join('.');
        const region = store.regions[regionId];
        if (!region || !region.regionMap) return undefined;
        for (const row of region.regionMap) {
            if (!row) continue;
            for (const cell of row) {
                if (cell && cell.id === blockId) return cell;
            }
        }
        return undefined;
    },

    async saveNewBlock(block) {
        // Block will be captured by the saveRegion call that follows block creation.
    },

    async saveBlock(block) {
        const blockJson = block.toJson();
        const regionId = blockJson.id.split('.').slice(0, -1).join('.');
        const region = store.regions[regionId];
        if (!region || !region.regionMap) return;
        for (const row of region.regionMap) {
            if (!row) continue;
            for (const cell of row) {
                if (cell && cell.id === blockJson.id) {
                    cell.resources = blockJson.resources;
                    await persistToDisk();
                    return;
                }
            }
        }
    }
};
