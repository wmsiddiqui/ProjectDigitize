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
	beforeEach(function() {
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

	afterEach(function() {
		Math.random.restore();
	});
	describe('create', function() {
		it('should create the block correctly with no resources', function() {
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
		it('should create the block correctly with equal resources without bias', function() {
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
	describe('generate resources tests', function() {
		it('should generate new resources correctly', function() {
			var blockInitProperties = {
				cap: 50,
				altitude: 10
			};
			var testBlock = new Block(1, blockInitProperties, blockSaver);
			var numberOfResourcesToGenerate = 30;

			var generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);
			assert.equal(generatedResources.etherGenerated, 10);
			assert.equal(generatedResources.plasmaGenerated, 10);
			assert.equal(generatedResources.matterGenerated, 10);
		});

		it('should not generate new resources if cap is met', function() {
			var blockInitProperties = {
				cap: 50,
				altitude: 10,
				resourceInitCount: 50
			};
			var testBlock = new Block(1, blockInitProperties, blockSaver);
			var numberOfResourcesToGenerate = 30;

			var generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);
			assert.equal(generatedResources.etherGenerated, 0);
			assert.equal(generatedResources.plasmaGenerated, 0);
			assert.equal(generatedResources.matterGenerated, 0);
		});

		it('should generate new resources in proportion if total added exceeds cap with no bias', function() {
			var blockInitProperties = {
				cap: 30,
				altitude: 10
			};

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			var numberOfResourcesToGenerate = 1000;
			var generatedSingleSource = 10;

			var generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);

			assert.equal(generatedResources.etherGenerated, generatedSingleSource);
			assert.equal(generatedResources.plasmaGenerated, generatedSingleSource);
			assert.equal(generatedResources.matterGenerated, generatedSingleSource);
		});

		xit('should generate new resources in proportion if total added exceeds cap dirty', function() {
			var blockInitProperties = {
				altitude: 10,
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
