const chai = require('chai');
const assert = chai.assert;
const Block = require('../../worldGenerator/models/block');
const sinon = require('sinon');

const blockSaver = {
	saveBlock: function(block) {
		return true;
	}
};

describe('block tests', function() {
	beforeEach(function() {
		let randomCounter = 0;
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
			const id = 1;

			const blockInitProperties = {
				blockType: { cap: 30 }
			};

			const testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 0);
			assert.equal(testBlock._plasma, 0);
			assert.equal(testBlock._matter, 0);
			assert.equal(testBlock.getId(), id);
		});
		it('should create the block correctly with equal resources without bias', function() {
			const id = 1;

			const blockInitProperties = {
				resourceInitCount: 30,
				blockType: { cap: 30 }
			};

			const testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 10);
			assert.equal(testBlock._plasma, 10);
			assert.equal(testBlock._matter, 10);
			assert.equal(testBlock.getId(), id);
		});
		it('should create the block correctly with bias', function() {
			const id = 1;

			const blockInitProperties = {
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

			const testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock._ether, 20);
			assert.equal(testBlock._plasma, 0);
			assert.equal(testBlock._matter, 10);
			assert.equal(testBlock.getId(), id);
		});
		it('should create the block correctly with blockType', function() {
			const id = 1;

			const blockInitProperties = {
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

			const testBlock = new Block(id, blockInitProperties, blockSaver);

			assert.equal(testBlock.blockTypeId, blockInitProperties.blockType.id);
		});
		it('should not create the block correctly with long decimals', function() {
			const id = 1;

			const blockInitProperties = {
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
			const blockInitProperties = {
				blockType: { cap: 30 }
			};
			const testBlock = new Block(1, blockInitProperties, blockSaver);
			const numberOfResourcesToGenerate = 30;

			const generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);
			assert.equal(generatedResources.etherGenerated, 10);
			assert.equal(generatedResources.plasmaGenerated, 10);
			assert.equal(generatedResources.matterGenerated, 10);
		});

		it('should not generate new resources if cap is met', function() {
			const blockInitProperties = {
				resourceInitCount: 50,
				blockType: {
					cap: 30
				}
			};
			const testBlock = new Block(1, blockInitProperties, blockSaver);
			const numberOfResourcesToGenerate = 30;

			const generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);
			assert.equal(generatedResources.etherGenerated, 0);
			assert.equal(generatedResources.plasmaGenerated, 0);
			assert.equal(generatedResources.matterGenerated, 0);
		});

		it('should generate new resources in proportion if total added exceeds cap with no bias', function() {
			const blockInitProperties = {
				blockType: {
					cap: 30
				}
			};

			const testBlock = new Block(1, blockInitProperties, blockSaver);

			const numberOfResourcesToGenerate = 1000;
			const generatedSingleSource = 10;

			const generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);

			assert.equal(generatedResources.etherGenerated, generatedSingleSource);
			assert.equal(generatedResources.plasmaGenerated, generatedSingleSource);
			assert.equal(generatedResources.matterGenerated, generatedSingleSource);
		});

		it('should generate new resources in proportion if total added exceeds cap with bias', function() {
			const blockInitProperties = {
				blockType: {
					bias: {
						etherBias: 0.7,
						plasmaBias: 0.1,
						matterBias: 0.2
					},
					cap: 30
				}
			};

			const testBlock = new Block(1, blockInitProperties, blockSaver);

			const numberOfResourcesToGenerate = 1000;
			const generatedResources = testBlock.generateResources(numberOfResourcesToGenerate);

			const expectedEther = 20;
			const expectedPlasma = 0;
			const expectedMatter = 10;
			const totalGenerated =
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
			const blockInitProperties = {
				resourceInitCount: 30,
				blockType: { cap: 30 }
			};

			const etherDecrement = 10;
			const plasmaDecrement = 2;
			const matterDecrement = 3;

			const testBlock = new Block(1, blockInitProperties, blockSaver);

			const consumeResult = testBlock.consumeResources(etherDecrement, plasmaDecrement, matterDecrement);

			assert.isTrue(consumeResult);
		});

		it('should not consume resources and return false if there are enough resources', function() {
			const blockInitProperties = {
				resourceInitCount: 30,
				blockType: { cap: 30 }
			};

			const etherDecrement = 11;
			const plasmaDecrement = 2;
			const matterDecrement = 3;

			const testBlock = new Block(1, blockInitProperties, blockSaver);

			const consumeResult = testBlock.consumeResources(etherDecrement, plasmaDecrement, matterDecrement);

			assert.isFalse(consumeResult);
		});
	});
});
