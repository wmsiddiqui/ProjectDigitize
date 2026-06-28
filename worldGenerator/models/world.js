const Region = require('./region');

const FACE_NAMES = ['top', 'bottom', 'front', 'back', 'left', 'right'];

class World {
    constructor(id, regionSize, saveClient, blockTypesProvider) {
        this._id = id;
        this._regionSize = regionSize;
        this._saveClient = saveClient;
        this._blockTypesProvider = blockTypesProvider;

        this._regions = {};
        for (const face of FACE_NAMES) {
            this._regions[face] = new Region(
                `${id}.${face}`,
                regionSize,
                saveClient,
                blockTypesProvider
            );
        }

        this._saveClient.saveWorld(this);
    }

    getRegion(face) {
        return this._regions[face] || null;
    }

    toJson() {
        return {
            id: this._id,
            regionSize: this._regionSize,
            regions: Object.fromEntries(
                Object.entries(this._regions).map(([face, region]) => [face, region._id])
            )
        };
    }

    static async fromJson(json, saveClient, blockTypesProvider) {
        const world = Object.create(World.prototype);
        world._id = json.id;
        world._regionSize = json.regionSize;
        world._saveClient = saveClient;
        world._blockTypesProvider = blockTypesProvider;
        world._regions = {};
        for (const [face, regionId] of Object.entries(json.regions || {})) {
            const regionJson = await saveClient.getRegion(regionId);
            if (regionJson) {
                world._regions[face] = Region.fromJson(regionJson, saveClient, blockTypesProvider);
            }
        }
        return world;
    }

    static get FACE_NAMES() {
        return FACE_NAMES;
    }
}

module.exports = World;
