const chai = require('chai');
const assert = chai.assert;
const proxyquire = require('proxyquire');

const worldModulePath = '../../worldGenerator/models/world';
const regionModulePath = '../../worldGenerator/models/region';

const mockBlockType = {
    id: 1,
    cap: 100,
    bias: { etherBias: 0.2, plasmaBias: 0.4, matterBias: 0.4 }
};

const blockTypeGeneratorMock = class {
    getCalculatedBlockType() { return mockBlockType; }
    getRandomBlockType() { return mockBlockType; }
    getBlockTypeFromSeed(seed) { return { ...mockBlockType, id: seed }; }
};

const saveClient = {
    saveBlock() { return true; },
    saveRegion() { return true; },
    saveWorld() { return true; }
};

const blockTypesProvider = { getBlockTypes() { } };

let World;
let MockRegion;

before(function () {
    MockRegion = proxyquire(regionModulePath, {
        '../utils/blockTypeGenerator': blockTypeGeneratorMock
    });
    World = proxyquire(worldModulePath, {
        './region': MockRegion
    });
});

describe('world', function () {
    describe('constructor', function () {
        it('should create a world with 6 regions', function () {
            const world = new World('earth', 5, saveClient, blockTypesProvider);
            assert.equal(world._id, 'earth');
            assert.equal(world._regionSize, 5);
            assert.equal(Object.keys(world._regions).length, 6);
        });

        it('should create all 6 named faces', function () {
            const world = new World('earth', 5, saveClient, blockTypesProvider);
            for (const face of ['top', 'bottom', 'front', 'back', 'left', 'right']) {
                assert.isDefined(world._regions[face], `Face '${face}' should exist`);
            }
        });

        it('should give all regions the same size', function () {
            const world = new World('earth', 7, saveClient, blockTypesProvider);
            for (const face of World.FACE_NAMES) {
                assert.equal(world._regions[face]._regionSize, 7);
            }
        });

        it('should namespace region IDs as worldId.face', function () {
            const world = new World('earth', 5, saveClient, blockTypesProvider);
            assert.equal(world._regions['top']._id, 'earth.top');
            assert.equal(world._regions['back']._id, 'earth.back');
        });
    });

    describe('getRegion', function () {
        it('should return the region for a valid face', function () {
            const world = new World('earth', 5, saveClient, blockTypesProvider);
            const region = world.getRegion('front');
            assert.isNotNull(region);
            assert.equal(region._id, 'earth.front');
        });

        it('should return null for an invalid face name', function () {
            const world = new World('earth', 5, saveClient, blockTypesProvider);
            assert.isNull(world.getRegion('diagonal'));
        });
    });

    describe('toJson', function () {
        it('should serialize id and regionSize', function () {
            const world = new World('earth', 5, saveClient, blockTypesProvider);
            const json = world.toJson();
            assert.equal(json.id, 'earth');
            assert.equal(json.regionSize, 5);
        });

        it('should serialize regions as a map of face to regionId string', function () {
            const world = new World('earth', 5, saveClient, blockTypesProvider);
            const json = world.toJson();
            assert.equal(Object.keys(json.regions).length, 6);
            assert.equal(json.regions.top, 'earth.top');
            assert.equal(json.regions.front, 'earth.front');
            assert.equal(json.regions.back, 'earth.back');
        });
    });

    describe('fromJson', function () {
        it('should reconstruct a world from JSON', async function () {
            const world = new World('earth', 5, saveClient, blockTypesProvider);
            const json = world.toJson();
            const topJson = world._regions['top'].toJson();

            const asyncSaveClient = {
                ...saveClient,
                getRegion: (id) => Promise.resolve(id === 'earth.top' ? topJson : null)
            };

            const reconstructed = await World.fromJson(json, asyncSaveClient, blockTypesProvider);
            assert.equal(reconstructed._id, 'earth');
            assert.equal(reconstructed._regionSize, 5);
            assert.isNotNull(reconstructed._regions['top']);
        });

        it('should handle missing regions gracefully', async function () {
            const json = {
                id: 'earth',
                regionSize: 5,
                regions: { top: 'earth.top', front: 'earth.front' }
            };
            const asyncSaveClient = {
                ...saveClient,
                getRegion: () => Promise.resolve(null)
            };

            const reconstructed = await World.fromJson(json, asyncSaveClient, blockTypesProvider);
            assert.equal(reconstructed._id, 'earth');
            assert.equal(Object.keys(reconstructed._regions).length, 0);
        });
    });

    describe('FACE_NAMES', function () {
        it('should expose the 6 face names as a static property', function () {
            assert.deepEqual(World.FACE_NAMES, ['top', 'bottom', 'front', 'back', 'left', 'right']);
        });
    });
});
