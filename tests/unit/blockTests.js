var chai = require('chai');
var assert = chai.assert;
var Block = require('../../worldGenerator/models/block');

describe('block tests', function() {
	it('should create the block correctly', function() {
		var altitude = 10;
		var ether = 20;
		var plasma = 30;
		var matter = 40;
		var cap = 50;
		var name = 'testName';
		var testBlock = new Block(name, altitude, ether, plasma, matter, cap);

		assert.equal(testBlock._ether, ether);
		assert.equal(testBlock._plasma, plasma);
		assert.equal(testBlock._matter, matter);
		assert.equal(testBlock._altitude, altitude);
		assert.equal(testBlock._cap, cap);
		assert.equal(testBlock.getName(), name);
	});

	it('should generate new resources correctly', function() {
		var ether = 20;
		var plasma = 30;
		var matter = 40;

		var etherIncrement = 1;
		var plasmaIncrement = 2;
		var matterIncrement = 3;

		var testBlock = new Block('Test', 10, ether, plasma, matter, 100);

		testBlock.generateResources(etherIncrement, plasmaIncrement, matterIncrement);

		assert.equal(testBlock._ether, ether + etherIncrement);
		assert.equal(testBlock._plasma, plasma + plasmaIncrement);
		assert.equal(testBlock._matter, matter + matterIncrement);
	});
});
