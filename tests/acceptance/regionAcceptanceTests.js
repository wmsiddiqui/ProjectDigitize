var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var Region = require('../../worldGenerator/models/region');
var blockSaver = require('../../worldGenerator/utils/redisSaveClient');
var mockSaver = {
	saveBlock: function() {}
};

var mockBlockTypesProvider = {
	getBlockTypes() {
		return {
			'1': {
				id: 1,
				correlations: {
					3: 0.9,
					2: 0.1
				},
				cap: 20
			},
			'2': {
				id: 2,
				correlations: {
					3: -0.3
				},
				cap: 30
			},
			'3': {
				id: 3,
				correlations: {
					2: 0.9
				},
				cap: 30
			},
			'4': {
				id: 4,
				correlations: {
					2: 0.9
				},
				cap: 30
			}
		};
	}
};

describe('regionAcceptanceTests', function() {
	it('creates region correctly', function() {
		//Create a region with a seeded value
		var seed = 1;
		var region = new Region(1, 3, blockSaver, mockBlockTypesProvider, seed);

		assert.equal(Object.keys(region._availableAreas).length, 0, 'New region should not have availibity');
		assert.equal(region._occupiedAreas.size, 0, 'New region should not have occupied areas');

		var availableAreas = region._availableAreas;
		var block = region.createBlock();
		assert.equal(block.blockTypeId, seed, "First block type's id does not match seed");

		//Verify that blocks around newly created block are now availible
		assert.equal(region._occupiedAreas.size, 1, 'Single block should occupy region');
		assert.equal(Object.keys(region._availableAreas).length, 4, 'All neighbors of first block should be available');

		//Add a new block and confirm occupied areas and available areas
		var secondBlock = region.createBlock();
		assert.isTrue(secondBlock.blockTypeId == '3' || secondBlock.blockTypeId == '2');
		assert.equal(region._occupiedAreas.size, 2, 'Two blocks should occupy region');

		region.createBlock();
		region.createBlock();
		region.createBlock();
		region.createBlock();
		region.createBlock();
		region.createBlock();
		region.createBlock();

		assert.equal(Object.keys(region._availableAreas).length, 0);

		//Add another block when map is full. It should throw an exception.
		assert.throws(function() {
			region.createBlock();
		});

		blockSaver.closeConnection();
	});
});
