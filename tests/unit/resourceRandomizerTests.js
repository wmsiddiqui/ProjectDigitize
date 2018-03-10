var chai = require('chai');
var assert = chai.assert;
var resourceRandomizer = require('../../worldGenerator/utils/resourceRandomizer');

describe('resource randomizer tests', function() {
	xit('should create resources almost equally with no bias - MANUAL TESTING ONLY!', function() {
		var resourcesToGenerate = 1000;
		var generatedResults = resourceRandomizer.getResources(resourcesToGenerate);
		assert.isTrue(
			generatedResults.etherGenerated >= 300 - 50 && generatedResults.etherGenerated <= 300 + 50,
			'generated ' + generatedResults.etherGenerated + ' ether'
		);
		assert.isTrue(
			generatedResults.plasmaGenerated >= 300 - 50 && generatedResults.plasmaGenerated <= 300 + 50,
			'generated ' + generatedResults.plasmaGenerated + ' plasma'
		);
		assert.isTrue(
			generatedResults.matterGenerated >= 300 - 50 && generatedResults.matterGenerated <= 300 + 50,
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
