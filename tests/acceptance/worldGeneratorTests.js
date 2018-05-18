var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var Region = require('../../worldGenerator/models/region');

describe('worldGenerator tests', function() {
	it('creates region correctly', function() {
		var region = new Region(1, 3, null);
		var availableAreas = region._availableAreas;
		var block = region.createBlock();
		console.log(availableAreas);
	});
});
