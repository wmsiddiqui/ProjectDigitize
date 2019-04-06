const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const Region = require('../../worldGenerator/models/region');
const modulePath = '../../worldGenerator/models/region';

const saveClient = {
	saveBlock: function() {
		return true;
	},
	saveRegion: function() {
		return true;
	}
};

const blockTypesProvider = {
	getBlockTypes() {}
};

//Since blockTypeGenerator is a class, mock out a class here
const blockTypeGeneratorMock = class {
	getCalculatedBlockType() {
		return {
			id: 1,
			cap: 100,
			bias: {
				etherBias: 0.2,
				plasmaBias: 0.4,
				matterBias: 0.4
			}
		};
	}
	getRandomBlockType() {
		return {
			id: 1,
			cap: 100,
			bias: {
				etherBias: 0.2,
				plasmaBias: 0.4,
				matterBias: 0.4
			}
		};
	}
	getBlockTypeFromSeed(seed) {
		return {
			id: seed,
			cap: 100,
			bias: {
				etherBias: 0.2,
				plasmaBias: 0.4,
				matterBias: 0.4
			}
		};
	}
};

describe('region', function() {
	describe('create region', function() {
		it('should create region', function() {
			const region = new Region(1, 11, saveClient, blockTypesProvider);
			assert.equal(1, region._id);
			assert.equal(11, region._regionSize);
		});
		it('should throw error if region is negative', function() {
			assert.throws(function() {
				new Region(1, -1, null, blockTypesProvider);
			});
		});
		it('should throw error if region is 0', function() {
			assert.throws(function() {
				new Region(1, 0, null, blockTypesProvider);
			});
		});
		it('should throw error if region is over 200', function() {
			assert.throws(function() {
				new Region(1, 201, null, blockTypesProvider);
			});
		});
	});
	describe('create first block', function() {
		it('should correctly create the first block', function() {
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.1;
			});
			const region = proxyquire(modulePath, { '../utils/blockTypeGenerator': blockTypeGeneratorMock });
			const sut = new region(1, 101, saveClient, blockTypesProvider);
			const block = sut.createBlock();
			Math.random.restore();
			const blockFromMap = sut._regionMap[50][50];
			assert.isTrue(block.blockTypeId != undefined, 'Block should not be undefined');
			assert.isTrue(block._bias != undefined, 'Bias should not be undefined');
			assert.equal(block, blockFromMap);
		});

		it('should correctly create the first block with a seeded value', function() {
			const seed = 3;
			const region = proxyquire(modulePath, { '../utils/blockTypeGenerator': blockTypeGeneratorMock });
			const sut = new region(1, 101, saveClient, blockTypesProvider, seed);
			const block = sut.createBlock();
			const blockFromMap = sut._regionMap[50][50];
			assert.isTrue(block.blockTypeId != undefined, 'Block should not be undefined');
			assert.isTrue(block._bias != undefined, 'Bias should not be undefined');
			assert.equal(block, blockFromMap);
			assert.equal(block.blockTypeId, seed);
		});
	});

	describe('create additional blocks', function() {
		it('should correctly create the second block', function() {
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.1;
			});
			//Why isn't neighbor helper mocked out?
			const region = proxyquire(modulePath, { '../utils/blockTypeGenerator': blockTypeGeneratorMock });
			const sut = new region(1, 101, saveClient, blockTypesProvider);
			const block1 = sut.createBlock();
			const block2 = sut.createBlock();
			Math.random.restore();
			assert.isTrue(block2.blockTypeId != undefined, 'Block should not be undefined');
			assert.isTrue(block2._bias != undefined, 'Bias should not be undefined');
		});
	});
});
