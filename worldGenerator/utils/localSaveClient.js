const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'regions.json');

let store = {};

const loadFromDisk = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const raw = await fs.readFile(DATA_FILE, 'utf8');
        store = JSON.parse(raw);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.warn(`Could not load data file, starting fresh: ${err.message}`);
        }
        store = {};
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
        return store[regionId];
    },

    getAllRegions() {
        return Object.values(store);
    },

    async saveRegion(region) {
        const regionJson = region.toJson();
        store[regionJson.id] = regionJson;
        await persistToDisk();
    },

    async getBlock(blockId) {
        if (!blockId || !blockId.length) {
            throw new Error('BlockId is required to getBlock');
        }
        const regionId = blockId.split('.')[0];
        const region = store[regionId];
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
        const regionId = blockJson.id.split('.')[0];
        const region = store[regionId];
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
        // Block not yet in regionMap (still in constructor); saveRegion will capture it.
    }
};
