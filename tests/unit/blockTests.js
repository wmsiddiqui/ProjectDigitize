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
		sinon.stub(Math, 'random').callsFake(function() {
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
				altitude: 10,
				blockType: { cap: 30 }
			};

			var testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 0);
			assert.equal(testBlock._plasma, 0);
			assert.equal(testBlock._matter, 0);
			assert.equal(testBlock._altitude, blockInitProperties.altitude);
			assert.equal(testBlock.getId(), id);
		});
		it('should create the block correctly with equal resources without bias', function() {
			var id = 1;

			var blockInitProperties = {
				altitude: 10,
				resourceInitCount: 30,
				blockType: { cap: 30 }
			};

			var testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 10);
			assert.equal(testBlock._plasma, 10);
			assert.equal(testBlock._matter, 10);
			assert.equal(testBlock._altitude, blockInitProperties.altitude);
			assert.equal(testBlock.getId(), id);
		});
		it('should create the block correctly with bias', function() {
			var id = 1;

			var blockInitProperties = {
				altitude: 10,
				resourceInitCount: 30,
				blockType: {
					bias: {
						etherBias: 0.7,
						plasmaBias: 0.2,
						matterBias: 0.1
					},
					cap: 30
				}
			};

			var testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 20);
			assert.equal(testBlock._plasma, 0);
			assert.equal(testBlock._matter, 10);
			assert.equal(testBlock._altitude, blockInitProperties.altitude);
			assert.equal(testBlock.getId(), id);
		});
		it('should create the block correctly with blockType', function() {
			var id = 1;

			var blockInitProperties = {
				altitude: 10,
				resourceInitCount: 30,
				blockType: {
					id: 1,
					name: 'TestType',
					bias: {
						etherBias: 0.7,
						plasmaBias: 0.2,
						matterBias: 0.1
					},
					cap: 30
				}
			};

			var testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock.blockTypeId, blockInitProperties.blockType.id);
		});
		it('should not create the block correctly with long decimals', function() {
			var id = 1;

			var blockInitProperties = {
				altitude: 10,
				blockType: {
					bias: {
						etherBias: 0.33333,
						plasmaBias: 0.33333,
						matterBias: 0.33334
					}
				}
			};

			assert.throws(function() {
				new Block(id, blockInitProperties, blockSaver);
			});
		});
	});
	describe('generate resources tests', function() {
		it('should generate new resources correctly', function() {
			var blockInitProperties = {
				altitude: 10,
				blockType: { cap: 30 }
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
				altitude: 10,
				resourceInitCount: 50,
				blockType: {
					cap: 30
				}
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
				altitude: 10,
				blockType: {
					cap: 30
				}
			};

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			var numberOfResourcesToGenerate = 1000;
			var generatedSingleSource = 10;

			var generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);

			assert.equal(generatedResources.etherGenerated, generatedSingleSource);
			assert.equal(generatedResources.plasmaGenerated, generatedSingleSource);
			assert.equal(generatedResources.matterGenerated, generatedSingleSource);
		});

		it('should generate new resources in proportion if total added exceeds cap with bias', function() {
			var blockInitProperties = {
				altitude: 10,
				blockType: {
					bias: {
						etherBias: 0.7,
						plasmaBias: 0.1,
						matterBias: 0.2
					},
					cap: 30
				}
			};

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			var numberOfResourcesToGenerate = 1000;
			var generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);

			var expectedEther = 20;
			var expectedPlasma = 0;
			var expectedMatter = 10;
			var totalGenerated =
				generatedResources.etherGenerated +
				generatedResources.plasmaGenerated +
				generatedResources.matterGenerated;

			assert.equal(totalGenerated, blockInitProperties.blockType.cap);
			assert.equal(generatedResources.etherGenerated, expectedEther);
			assert.equal(generatedResources.plasmaGenerated, expectedPlasma);
			assert.equal(generatedResources.matterGenerated, expectedMatter);
		});
	});
	describe('consume tests', function() {
		it('should consume resources and return true if there are enough resources', function() {
			var blockInitProperties = {
				altitude: 10,
				resourceInitCount: 30,
				blockType: { cap: 30 }
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
				resourceInitCount: 30,
				blockType: { cap: 30 }
			};

			var etherDecrement = 11;
			var plasmaDecrement = 2;
			var matterDecrement = 3;

			var testBlock = new Block(1, blockInitProperties, blockSaver);

			var consumeResult = testBlock.consumeResources(etherDecrement, plasmaDecrement, matterDecrement);

			assert.isFalse(consumeResult);
		});
	});
});
