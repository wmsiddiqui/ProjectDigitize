const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'regions.json');

// In-memory store; structure: { [regionId]: { ...regionFields, [blockIndex]: blockData } }
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

const persistToDisk = async () => {
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
};

// Navigate a dot-path like 'regionId.0' within store, returning the value
const getByPath = (dotPath) => {
    const keys = dotPath.split('.');
    return keys.reduce((cur, key) => (cur != null ? cur[key] : undefined), store);
};

// Set a value at a dot-path like 'regionId.0' within store
const setByPath = (dotPath, value) => {
    const keys = dotPath.split('.');
    const lastKey = keys.pop();
    const parent = keys.reduce((cur, key) => {
        if (cur[key] == null || typeof cur[key] !== 'object') {
            cur[key] = {};
        }
        return cur[key];
    }, store);
    parent[lastKey] = value;
};

loadFromDisk();

module.exports = {
    async closeConnection() {
        // No connection to close for file-based storage
    },

    async getRegion(regionId) {
        if (!regionId || !regionId.length) {
            throw new Error('RegionId is required to getRegion');
        }
        return store[regionId];
    },

    async saveRegion(region) {
        const regionJson = region.toJson();
        // Merge into any existing entry so nested block data is preserved
        store[regionJson.id] = Object.assign(store[regionJson.id] || {}, regionJson);
        await persistToDisk();
    },

    async getBlock(blockId) {
        if (!blockId || !blockId.length) {
            throw new Error('BlockId is required to getBlock');
        }
        return getByPath(blockId);
    },

    async saveNewBlock(block) {
        const blockJson = block.toJson();
        setByPath(blockJson.id, blockJson);
        await persistToDisk();
    },

    async saveBlock(block) {
        const blockJson = block.toJson();
        setByPath(`${blockJson.id}.resources`, blockJson.resources);
        await persistToDisk();
    }
};
