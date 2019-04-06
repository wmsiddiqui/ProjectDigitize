const nconf = require('nconf');
const numberChecker = require('./numberChecker');
const biasValidator = require('./biasValidator');

const configPath = 'configs/blockTypes.json';
nconf.overrides({ always: 'be this value' });
nconf.argv().env().file({ file: configPath });
let results;

exports.getBlockTypes = function() {
	if (!results) {
		let allBlockTypes = nconf.get('blockTypes');
		for (let blockType in allBlockTypes) {
			let currentBlock = allBlockTypes[blockType];
			currentBlock.id = blockType;

			validateCorrelations(currentBlock.correlations);
			validateBiases(currentBlock.biases);
		}
		results = allBlockTypes;
	}
	return results;
};

let validateCorrelations = function(correlations) {
	if (!correlations) {
		return;
	}
	let correlationsSum = 0;
	for (let correlation in correlations) {
		let currentCorrelation = correlations[correlation];

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

let validateBiases = function(biases) {
	if (!biases) {
		return;
	}
	biasValidator.validateBias(biases);
};
