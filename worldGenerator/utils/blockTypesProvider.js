var nconf = require('nconf');
var numberChecker = require('./numberChecker');
var biasValidator = require('./biasValidator');

var configPath = 'configs/blockTypes.json';
nconf.overrides({ always: 'be this value' });
nconf.argv().env().file({ file: configPath });
var results;

exports.getBlockTypes = function() {
	if (!results) {
		var allBlockTypes = nconf.get('blockTypes');
		for (var blockType in allBlockTypes) {
			var currentBlock = allBlockTypes[blockType];
			currentBlock.id = blockType;

			validateCorrelations(currentBlock.correlations);
			validateBiases(currentBlock.biases);
		}
		results = allBlockTypes;
	}
	return results;
};

var validateCorrelations = function(correlations) {
	if (!correlations) {
		return;
	}
	var correlationsSum = 0;
	for (var correlation in correlations) {
		var currentCorrelation = correlations[correlation];

		if (
			!numberChecker.isNumber(currentCorrelation) ||
			!numberChecker.isNumberWithOnly3DecimalDigits(currentCorrelation)
		) {
			throw new Error('Correlations must be numbers with up to 3 decimal places');
		}
		if (currentCorrelation > 1 || currentCorrelation < -1) {
			throw new Error('Correlation must be between -1 and 1');
		}
		correlationsSum += currentCorrelation * 1000;
	}
	if (correlationsSum / 1000 > 1 || correlationsSum / 1000 < -1) {
		throw new Error('Total Correlations must be between -1 and 1');
	}
};

var validateBiases = function(biases) {
	if (!biases) {
		return;
	}
	biasValidator.validateBias(biases);
};
