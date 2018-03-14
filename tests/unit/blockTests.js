var chai = require('chai');
var assert = chai.assert;
var Block = require('../../worldGenerator/models/block');
var sinon = require('sinon');

var blockSaver = {
	saveBlock: function(block) {
		return true;
	}
};

describe('block tests', function() {
	before(function() {
		var randomCounter = 0;
		var random = sinon.stub(Math, 'random').callsFake(function() {
			randomCounter++;
			if (randomCounter <= 10) {
				return 0.3;
			} else if (randomCounter <= 20) {
				return 0.6;
			} else {
				return 0.9;
			}
		});
	});

	after(function() {
		Math.random.restore();
	});

	describe('create', function() {
		xit('should create the block correctly with no resources', function() {
			var id = 1;

			var blockInitProperties = {
				cap: 50,
				altitude: 10
			};

			var testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 0);
			assert.equal(testBlock._plasma, 0);
			assert.equal(testBlock._matter, 0);
			assert.equal(testBlock._altitude, blockInitProperties.altitude);
			assert.equal(testBlock._cap, blockInitProperties.cap);
			assert.equal(testBlock.getId(), id);
		});
		xit('should create the block correctly with equal resources without bias', function() {
			var id = 1;

			var blockInitProperties = {
				cap: 50,
				altitude: 10,
				resourceInitCount: 30
			};

			var testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 10);
			assert.equal(testBlock._plasma, 10);
			assert.equal(testBlock._matter, 10);
			assert.equal(testBlock._altitude, blockInitProperties.altitude);
			assert.equal(testBlock._cap, blockInitProperties.cap);
			assert.equal(testBlock.getId(), id);
		});
		it('should create the block correctly with bias', function() {
			var id = 1;

			var blockInitProperties = {
				cap: 50,
				altitude: 10,
				resourceInitCount: 30,
				bias: {
					etherBias: 0.7,
					plasmaBias: 0.2,
					matterBias: 0.1
				}
			};

			var testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 20);
			assert.equal(testBlock._plasma, 0);
			assert.equal(testBlock._matter, 10);
			assert.equal(testBlock._altitude, blockInitProperties.altitude);
			assert.equal(testBlock._cap, blockInitProperties.cap);
			assert.equal(testBlock.getId(), id);
		});
	});
	xdescribe('generate exact resources tests', function() {
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

			testBlock.generateExactResources(etherIncrement, plasmaIncrement, matterIncrement);

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

			testBlock.generateExactResources(etherIncrement, plasmaIncrement, matterIncrement);

			assert.equal(testBlock._ether, blockInitProperties.ether);
			assert.equal(testBlock._plasma, blockInitProperties.plasma);
			assert.equal(testBlock._matter, blockInitProperties.matter);
		});

		it('should generate new resources in proportion if total added exceeds cap - clean', function() {
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

			testBlock.generateExactResources(etherIncrement, plasmaIncrement, matterIncrement);

			var expectedEther = 50;
			var expectedPlasma = 20;
			var expectedMatter = 30;

			assert.equal(testBlock._ether, expectedEther);
			assert.equal(testBlock._plasma, expectedPlasma);
			assert.equal(testBlock._matter, expectedMatter);
		});

		it('should generate new resources in proportion if total added exceeds cap dirty', function() {
			var blockInitProperties = {
				altitude: 10,
				ether: 0,
				plasma: 0,
				matter: 0,
				cap: 100
			};

			var etherIncrement = 100;
			var plasmaIncrement = 40;
			var matterIncrement = 61;

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			testBlock.generateExactResources(etherIncrement, plasmaIncrement, matterIncrement);

			var expectedEther = 49;
			var expectedPlasma = 19;
			var expectedMatter = 30;

			assert.equal(testBlock._ether, expectedEther);
			assert.equal(testBlock._plasma, expectedPlasma);
			assert.equal(testBlock._matter, expectedMatter);
		});
	});
	xdescribe('consume tests', function() {
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
