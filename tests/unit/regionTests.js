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
			var region = new Region(1, 101, saveClient);
			var blockFromMap = region._regionMap[50 - 1][50];
		});
	});
});
