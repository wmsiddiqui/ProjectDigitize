const chai = require('chai');
const assert = chai.assert;
const resourceRandomizer = require('../../worldGenerator/utils/resourceRandomizer');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('resource randomizer', function() {
	describe('create correct number of resources when Math.random is mocked', function() {
		it('should create resources almost equally with no bias', function() {
			const resourcesToGenerate = 999;

			let randomCounter = 0;
			sinon.stub(Math, 'random').callsFake(function() {
				randomCounter++;
				if (randomCounter <= 333) {
					return 0.3;
				} else if (randomCounter <= 666) {
					return 0.6;
				} else {
					return 0.9;
				}
			});

			const generatedResults = resourceRandomizer.getResources(resourcesToGenerate);

			Math.random.restore();

			const totalGenerated =
				generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
			assert.equal(totalGenerated, resourcesToGenerate, 'Total resource generated was incorrect');

			assert.equal(
				generatedResults.etherGenerated,
				resourcesToGenerate / 3,
				'generated ' + generatedResults.etherGenerated + ' ether'
			);
			assert.equal(
				generatedResults.plasmaGenerated,
				resourcesToGenerate / 3,
				'generated ' + generatedResults.plasmaGenerated + ' plasma'
			);
			assert.equal(
				generatedResults.matterGenerated,
				resourcesToGenerate / 3,
				'generated ' + generatedResults.matterGenerated + ' matter'
			);
		});

		it('should create resources according to the bias', function() {
			const resourcesToGenerate = 1000;
			const bias = {
				etherBias: 0.5,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			let randomCounter = 0;
			sinon.stub(Math, 'random').callsFake(function() {
				randomCounter++;
				if (randomCounter <= 500) {
					return 0.3;
				} else if (randomCounter <= 800) {
					return 0.6;
				} else {
					return 0.9;
				}
			});

			const generatedResults = resourceRandomizer.getResources(resourcesToGenerate, bias);

			Math.random.restore();

			assert.equal(
				generatedResults.etherGenerated,
				resourcesToGenerate * bias.etherBias,
				'generated ' + generatedResults.etherGenerated + ' ether'
			);
			assert.equal(
				generatedResults.plasmaGenerated,
				resourcesToGenerate * bias.plasmaBias,
				'generated ' + generatedResults.plasmaGenerated + ' plasma'
			);
			assert.equal(
				generatedResults.matterGenerated,
				resourcesToGenerate * bias.matterBias,
				'generated ' + generatedResults.matterGenerated + ' matter'
			);
			const totalGenerated =
				generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
			assert.equal(totalGenerated, resourcesToGenerate);
		});

		it('should create resources according to the bias edge case', function() {
			const resourcesToGenerate = 1000;
			const bias = {
				etherBias: 0.5,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			let randomCounter = 0;
			sinon.stub(Math, 'random').callsFake(function() {
				randomCounter++;
				if (randomCounter <= 500) {
					return 0.5;
				} else if (randomCounter <= 800) {
					return 0.8;
				} else {
					return 0.9;
				}
			});

			const generatedResults = resourceRandomizer.getResources(resourcesToGenerate, bias);

			Math.random.restore();

			assert.equal(generatedResults.etherGenerated, 0, 'generated ' + generatedResults.etherGenerated + ' ether');
			assert.equal(
				generatedResults.plasmaGenerated,
				500,
				'generated ' + generatedResults.plasmaGenerated + ' plasma'
			);
			assert.equal(
				generatedResults.matterGenerated,
				500,
				'generated ' + generatedResults.matterGenerated + ' matter'
			);
			const totalGenerated =
				generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
			assert.equal(totalGenerated, resourcesToGenerate);
		});
	});

	describe('create only specific resource when other biases are 0', function() {
		it('should create only ether when other biases are 0', function() {
			const resourcesToGenerate = 1000;
			const bias = {
				etherBias: 1,
				plasmaBias: 0,
				matterBias: 0
			};

			const generatedResults = resourceRandomizer.getResources(resourcesToGenerate, bias);

			assert.equal(
				generatedResults.etherGenerated,
				resourcesToGenerate,
				'generated ' + generatedResults.etherGenerated + ' ether'
			);
			assert.equal(
				generatedResults.plasmaGenerated,
				0,
				'generated ' + generatedResults.plasmaGenerated + ' plasma'
			);
			assert.equal(
				generatedResults.matterGenerated,
				0,
				'generated ' + generatedResults.matterGenerated + ' matter'
			);
			const totalGenerated =
				generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
			assert.equal(totalGenerated, resourcesToGenerate);
		});

		it('should create only plasma when other biases are 0', function() {
			const resourcesToGenerate = 1000;
			const bias = {
				etherBias: 0,
				plasmaBias: 1,
				matterBias: 0
			};

			const generatedResults = resourceRandomizer.getResources(resourcesToGenerate, bias);

			assert.equal(generatedResults.etherGenerated, 0, 'generated ' + generatedResults.etherGenerated + ' ether');
			assert.equal(
				generatedResults.plasmaGenerated,
				resourcesToGenerate,
				'generated ' + generatedResults.plasmaGenerated + ' plasma'
			);
			assert.equal(
				generatedResults.matterGenerated,
				0,
				'generated ' + generatedResults.matterGenerated + ' matter'
			);
			const totalGenerated =
				generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
			assert.equal(totalGenerated, resourcesToGenerate);
		});

		it('should create only matter when other biases are 0', function() {
			const resourcesToGenerate = 1000;
			const bias = {
				etherBias: 0,
				plasmaBias: 0,
				matterBias: 1
			};

			const generatedResults = resourceRandomizer.getResources(resourcesToGenerate, bias);

			assert.equal(generatedResults.etherGenerated, 0, 'generated ' + generatedResults.etherGenerated + ' ether');
			assert.equal(
				generatedResults.plasmaGenerated,
				0,
				'generated ' + generatedResults.plasmaGenerated + ' plasma'
			);
			assert.equal(
				generatedResults.matterGenerated,
				resourcesToGenerate,
				'generated ' + generatedResults.matterGenerated + ' matter'
			);
			const totalGenerated =
				generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
			assert.equal(totalGenerated, resourcesToGenerate);
		});
	});
	describe('create correct number of resources total', function() {
		it('should create correct total number of resources with no bias', function() {
			const resourcesToGenerate = 1000;
			const generatedResults = resourceRandomizer.getResources(resourcesToGenerate);

			const totalGenerated =
				generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
			assert.equal(totalGenerated, resourcesToGenerate);
		});

		it('should create correct total number of resources with correct bias', function() {
			const resourcesToGenerate = 1000;

			const bias = {
				etherBias: 0.5,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			const generatedResults = resourceRandomizer.getResources(resourcesToGenerate, bias);

			const totalGenerated =
				generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
			assert.equal(totalGenerated, resourcesToGenerate);
		});

		it('should throw an error if bias is not correct', function() {
			const resourcesToGenerate = 1000;

			const bias = {
				etherBias: 0.1,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			assert.throws(function() {
				resourceRandomizer.getResources(resourcesToGenerate, bias);
			}, Error);
		});
	});
});
