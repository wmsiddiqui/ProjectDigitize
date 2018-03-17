var chai = require('chai');
var assert = chai.assert;
var Region = require('../../worldGenerator/models/region');

describe('region', function() {
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
			var saveClient = {
				saveBlock: function() {
					return true;
				}
			};
			var region = new Region(1, 101, saveClient);
			var block = region.createBlock();
			var blockFromMap = region._regionMap[50][50];
			var blockFromGet = region.getBlock(50, 50);
			assert.equal(block, blockFromMap);
			assert.equal(block, blockFromGet);
		});
		it('should correctly add neighbors to available areas', function() {
			var saveClient = {
				saveBlock: function() {
					return true;
				}
			};

			var regionSize = 101;
			var region = new Region(1, regionSize, saveClient);
			region.createBlock();

			var blockLocation = Math.floor(regionSize / 2);

			var leftNeighbor = region._availableAreas[blockLocation - 1 + ',' + blockLocation];
			var rightNeighbor = region._availableAreas[blockLocation + 1 + ',' + blockLocation];
			var downNeighbor = region._availableAreas[blockLocation + ',' + blockLocation - 1];
			var upNeighbor = region._availableAreas[blockLocation + ',' + blockLocation + 1];

			var blockAvailibility = region._availableAreas[blockLocation + ',' + blockLocation];
			assert.isTrue(blockAvailibility == undefined);

			assert.isTrue(leftNeighbor != undefined);
			assert.equal(blockLocation - 1, leftNeighbor[0]);
			assert.equal(blockLocation, leftNeighbor[1]);

			assert.isTrue(rightNeighbor != undefined);
			assert.equal(blockLocation + 1, rightNeighbor[0]);
			assert.equal(blockLocation, rightNeighbor[1]);

			assert.isTrue(downNeighbor != undefined);
			assert.equal(blockLocation, downNeighbor[0]);
			assert.equal(blockLocation - 1, downNeighbor[1]);

			assert.isTrue(upNeighbor != undefined);
			assert.equal(blockLocation, upNeighbor[0]);
			assert.equal(blockLocation + 1, upNeighbor[1]);
		});
	});
});
