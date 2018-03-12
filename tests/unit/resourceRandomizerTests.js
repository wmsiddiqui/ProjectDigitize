var chai = require('chai');
var assert = chai.assert;
var resourceRandomizer = require('../../worldGenerator/utils/resourceRandomizer');
var sinon = require('sinon');

describe('resource randomizer tests', function() {
	it('should create resources almost equally with no bias', function() {
		var resourcesToGenerate = 999;

		var randomCounter = 0;
		var random = sinon.stub(Math, 'random').callsFake(function() {
			randomCounter++;
			if (randomCounter <= 333) {
				return 0.3;
			} else if (randomCounter <= 666) {
				return 0.6;
			} else {
				return 0.9;
			}
		});

		var generatedResults = resourceRandomizer.getResources(resourcesToGenerate);

		var totalGenerated =
			generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
		assert.equal(totalGenerated, resourcesToGenerate, 'Total resource generated was incorrect');

		assert.isTrue(
			generatedResults.etherGenerated == resourcesToGenerate / 3,
			'generated ' + generatedResults.etherGenerated + ' ether'
		);
		assert.isTrue(
			generatedResults.plasmaGenerated == resourcesToGenerate / 3,
			'generated ' + generatedResults.plasmaGenerated + ' plasma'
		);
		assert.isTrue(
			generatedResults.matterGenerated == resourcesToGenerate / 3,
			'generated ' + generatedResults.matterGenerated + ' matter'
		);
	});

	xit('should create resources almost equally with correct bias - MANUAL TESTING ONLY!', function() {
		var resourcesToGenerate = 1000;
		var bias = {
			_etherBias: 0.5,
			_plasmaBias: 0.3,
			_matterBias: 0.2
		};

		var generatedResults = resourceRandomizer.getResources(resourcesToGenerate, bias);
		assert.isTrue(
			generatedResults.etherGenerated >= resourcesToGenerate * bias._etherBias - 50 &&
				generatedResults.etherGenerated <= resourcesToGenerate * bias._etherBias + 50,
			'generated ' + generatedResults.etherGenerated + ' ether'
		);
		assert.isTrue(
			generatedResults.plasmaGenerated >= resourcesToGenerate * bias._plasmaBias - 50 &&
				generatedResults.plasmaGenerated <= resourcesToGenerate * bias._plasmaBias + 50,
			'generated ' + generatedResults.plasmaGenerated + ' plasma'
		);
		assert.isTrue(
			generatedResults.matterGenerated >= resourcesToGenerate * bias._matterBias - 50 &&
				generatedResults.matterGenerated <= resourcesToGenerate * bias._matterBias + 50,
			'generated ' + generatedResults.matterGenerated + ' matter'
		);
		var totalGenerated =
			generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
		assert.equal(totalGenerated, resourcesToGenerate);
	});

	it('should create correct total number of resources with no bias', function() {
		var resourcesToGenerate = 1000;
		var generatedResults = resourceRandomizer.getResources(resourcesToGenerate);

		var totalGenerated =
			generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
		assert.equal(totalGenerated, resourcesToGenerate);
	});

	it('should create correct total number of resources with correct bias', function() {
		var resourcesToGenerate = 1000;

		var bias = {
			_etherBias: 0.5,
			_plasmaBias: 0.3,
			_matterBias: 0.2
		};

		var generatedResults = resourceRandomizer.getResources(resourcesToGenerate, bias);

		var totalGenerated =
			generatedResults.etherGenerated + generatedResults.plasmaGenerated + generatedResults.matterGenerated;
		assert.equal(totalGenerated, resourcesToGenerate);
	});

	it('should throw an error if bias is not correct', function() {
		var resourcesToGenerate = 1000;

		var bias = {
			_etherBias: 0.1,
			_plasmaBias: 0.3,
			_matterBias: 0.2
		};

		assert.throws(function() {
			resourceRandomizer.getResources(resourcesToGenerate, bias);
		}, Error);
	});
});
