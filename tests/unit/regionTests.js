var chai = require('chai');
var assert = chai.assert;
var Region = require('../../worldGenerator/models/region');
var sinon = require('sinon');

describe('region', function() {
	var saveClient = {
		saveBlock: function() {
			return true;
		}
	};
	describe('create region', function() {
		it('should create region', function() {
			var region = new Region(1, 11);
			assert.equal(1, region._id);
			assert.equal(11, region._regionSize);
		});
		it('should throw error if region is negative', function() {
			assert.throws(function() {
				new Region(1, -1);
			});
		});
		it('should throw error if region is 0', function() {
			assert.throws(function() {
				new Region(1, 0);
			});
		});
		it('should throw error if region is over 200', function() {
			assert.throws(function() {
				new Region(1, 201);
			});
		});
	});
	describe('create first block', function() {
		it('should correctly create the first block', function() {
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.1;
			});
			var region = new Region(1, 101, saveClient);
			var block = region.createBlock();
			Math.random.restore();
			var blockFromMap = region._regionMap[50][50];
			var blockFromGet = region.getBlock(50, 50);
			assert.isTrue(block._blockTypeId != undefined, 'Block should not be undefined');
			assert.isTrue(block._bias != undefined, 'Bias should not be undefined');
			assert.equal(block, blockFromMap);
			assert.equal(block, blockFromGet);
		});
		it('should correctly add neighbors to available areas', function() {
			var regionSize = 101;
			var region = new Region(1, regionSize, saveClient);
			region.createBlock();

			var blockLocation = Math.floor(regionSize / 2);

			var leftNeighbor = region._availableAreas[blockLocation - 1 + ',' + blockLocation];
			var rightNeighbor = region._availableAreas[blockLocation + 1 + ',' + blockLocation];
			var downNeighbor = region._availableAreas[blockLocation + ',' + (blockLocation - 1)];
			var upNeighbor = region._availableAreas[blockLocation + ',' + (blockLocation + 1)];

			var blockAvailibility = region._availableAreas[blockLocation + ',' + blockLocation];
			assert.isTrue(blockAvailibility == undefined, 'Block should no longer be available');

			assert.isTrue(leftNeighbor != undefined, 'Block to left should be available');
			assert.equal(blockLocation - 1, leftNeighbor[0]);
			assert.equal(blockLocation, leftNeighbor[1]);

			assert.isTrue(rightNeighbor != undefined, 'Block to right should be available');
			assert.equal(blockLocation + 1, rightNeighbor[0]);
			assert.equal(blockLocation, rightNeighbor[1]);

			assert.isTrue(downNeighbor != undefined, 'Block below should be available');
			assert.equal(blockLocation, downNeighbor[0]);
			assert.equal(blockLocation - 1, downNeighbor[1]);

			assert.isTrue(upNeighbor != undefined, 'Block above should be available');
			assert.equal(blockLocation, upNeighbor[0]);
			assert.equal(blockLocation + 1, upNeighbor[1]);
		});
	});

	describe('create additional blocks', function() {
		it('should correctly create the second block', function() {
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.1;
			});
			var region = new Region(1, 101, saveClient);
			var block1 = region.createBlock();
			var block2 = region.createBlock();
			Math.random.restore();
			assert.isTrue(block2._blockTypeId != undefined, 'Block should not be undefined');
			assert.isTrue(block2._bias != undefined, 'Bias should not be undefined');
		});
	});

	describe('get neighbor', function() {
		it('should return empty list if there are no neighbors', function() {
			var region = new Region(1, 3, saveClient);
			var block = region.createBlock();
			region._regionMap[0][1] = block;
			region._regionMap[2][1] = block;
			region._regionMap[1][0] = block;
			region._regionMap[1][2] = block;

			var neighbors = region.getNeighborBlocks([ 1, 1 ], region._regionMap);
			assert.equal(neighbors.length, 4);
		});
	});
});
