var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var Region = require('../../worldGenerator/models/region');

var mockSaver = {
	saveBlock: function() {}
};

describe('worldGenerator tests', function() {
	it('creates region correctly', function() {
		var seed = 1;
		var region = new Region(1, 3, mockSaver, seed);
		var availableAreas = region._availableAreas;
		var block = region.createBlock();
		assert.equal(block.blockTypeId, seed);
	});
});
