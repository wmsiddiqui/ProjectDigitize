var chai = require('chai');
var assert = chai.assert;
var Block = require('../../worldGenerator/models/block');

var blockSaver = {
	saveBlock: function(block) {
		return true;
	}
};

describe('block tests', function() {
	describe('create tests', function() {
		it('should create the block correctly', function() {
			var id = 1;

			var blockInitProperties = {
				altitude: 10,
				ether: 20,
				plasma: 30,
				matter: 40,
				cap: 50
			};

			var testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, blockInitProperties.ether);
			assert.equal(testBlock._plasma, blockInitProperties.plasma);
			assert.equal(testBlock._matter, blockInitProperties.matter);
			assert.equal(testBlock._altitude, blockInitProperties.altitude);
			assert.equal(testBlock._cap, blockInitProperties.cap);
			assert.equal(testBlock.getId(), id);
		});
	});
	describe('generate resources tests', function() {
		it('should generate new resources correctly', function() {
			var blockInitProperties = {
				altitude: 10,
				ether: 20,
				plasma: 30,
				matter: 40,
				cap: 100
			};

			var etherIncrement = 1;
			var plasmaIncrement = 2;
			var matterIncrement = 3;

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			testBlock.generateResources(etherIncrement, plasmaIncrement, matterIncrement);

			assert.equal(testBlock._ether, blockInitProperties.ether + etherIncrement);
			assert.equal(testBlock._plasma, blockInitProperties.plasma + plasmaIncrement);
			assert.equal(testBlock._matter, blockInitProperties.matter + matterIncrement);
		});

		it('should not generate new resources if cap is met', function() {
			var blockInitProperties = {
				altitude: 10,
				ether: 10,
				plasma: 10,
				matter: 10,
				cap: 30
			};

			var etherIncrement = 1;
			var plasmaIncrement = 2;
			var matterIncrement = 3;

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			testBlock.generateResources(etherIncrement, plasmaIncrement, matterIncrement);

			assert.equal(testBlock._ether, blockInitProperties.ether);
			assert.equal(testBlock._plasma, blockInitProperties.plasma);
			assert.equal(testBlock._matter, blockInitProperties.matter);
		});

		it('should generate new resources in proportion if total added exceeds cap', function() {
			var blockInitProperties = {
				altitude: 10,
				ether: 0,
				plasma: 0,
				matter: 0,
				cap: 100
			};

			var etherIncrement = 100;
			var plasmaIncrement = 40;
			var matterIncrement = 60;

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			testBlock.generateResources(etherIncrement, plasmaIncrement, matterIncrement);

			var expectedEther = 50;
			var expectedPlasma = 20;
			var expectedMatter = 30;

			assert.equal(testBlock._ether, expectedEther);
			assert.equal(testBlock._plasma, expectedPlasma);
			assert.equal(testBlock._matter, expectedMatter);
		});
	});
	describe('consume tests', function() {
		it('should consume resources and return true if there are enough resources', function() {
			var blockInitProperties = {
				altitude: 10,
				ether: 20,
				plasma: 30,
				matter: 40,
				cap: 50
			};

			var etherDecrement = 10;
			var plasmaDecrement = 2;
			var matterDecrement = 3;

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			var consumeResult = testBlock.consumeResources(etherDecrement, plasmaDecrement, matterDecrement);

			assert.isTrue(consumeResult);
		});

		it('should not consume resources and return false if there are enough resources', function() {
			var blockInitProperties = {
				altitude: 10,
				ether: 2,
				plasma: 30,
				matter: 40,
				cap: 50
			};

			var etherDecrement = 10;
			var plasmaDecrement = 2;
			var matterDecrement = 3;

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			var consumeResult = testBlock.consumeResources(etherDecrement, plasmaDecrement, matterDecrement);

			assert.isFalse(consumeResult);
		});
	});
});
