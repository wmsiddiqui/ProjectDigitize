var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var Region = require('../../worldGenerator/models/region');
var modulePath = '../../worldGenerator/models/region';

var saveClient = {
	saveBlock: function() {
		return true;
	}
};

var blockTypesProvider = {
	getBlockTypes() {}
};

//Since blockTypeGenerator is a class, mock out a class here
var blockTypeGeneratorMock = class {
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
			var region = new Region(1, 11, null, blockTypesProvider);
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
			var region = proxyquire(modulePath, { '../utils/blockTypeGenerator': blockTypeGeneratorMock });
			var sut = new region(1, 101, saveClient, blockTypesProvider);
			var block = sut.createBlock();
			Math.random.restore();
			var blockFromMap = sut._regionMap[50][50];
			assert.isTrue(block.blockTypeId != undefined, 'Block should not be undefined');
			assert.isTrue(block._bias != undefined, 'Bias should not be undefined');
			assert.equal(block, blockFromMap);
		});

		it('should correctly create the first block with a seeded value', function() {
			var seed = 3;
			var region = proxyquire(modulePath, { '../utils/blockTypeGenerator': blockTypeGeneratorMock });
			var sut = new region(1, 101, saveClient, blockTypesProvider, seed);
			var block = sut.createBlock();
			var blockFromMap = sut._regionMap[50][50];
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
			var region = proxyquire(modulePath, { '../utils/blockTypeGenerator': blockTypeGeneratorMock });
			var sut = new region(1, 101, saveClient, blockTypesProvider);
			var block1 = sut.createBlock();
			var block2 = sut.createBlock();
			Math.random.restore();
			assert.isTrue(block2.blockTypeId != undefined, 'Block should not be undefined');
			assert.isTrue(block2._bias != undefined, 'Bias should not be undefined');
		});
	});
});
