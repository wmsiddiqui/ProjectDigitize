var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var Region = require('../../worldGenerator/models/region');

var mockSaver = {
	saveBlock: function() {}
};

describe('regionAcceptanceTests', function() {
	it('creates region correctly', function() {
		//Create a region with a seeded value
		var seed = 1;
		var region = new Region(1, 3, mockSaver, seed);

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
		assert.isTrue(secondBlock.blockTypeId == '6' || secondBlock.blockTypeId == '3');
		assert.equal(region._occupiedAreas.size, 2, 'Two blocks should occupy region');

		assert.equal(Object.keys(region._availableAreas).length, 5);
	});
});
