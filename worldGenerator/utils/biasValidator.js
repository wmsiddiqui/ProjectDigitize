const numberChecker = require('./numberChecker');

exports.validateBias = function(bias) {
	if (
		!numberChecker.isPositiveNumber(bias.etherBias) ||
		!numberChecker.isPositiveNumber(bias.plasmaBias) ||
		!numberChecker.isPositiveNumber(bias.matterBias)
	) {
		throw new Error('All bias must be greater than zero');
	}

	if (
		!numberChecker.isNumberWithOnly3DecimalDigits(bias.etherBias) ||
		!numberChecker.isNumberWithOnly3DecimalDigits(bias.plasmaBias) ||
		!numberChecker.isNumberWithOnly3DecimalDigits(bias.matterBias)
	) {
		throw new Error('Invalid Bias. Only precision of 3 decimal places is supported.');
	}

	//Multiply and then divide by 1000 to maintain precision
	if ((bias.etherBias * 1000 + bias.plasmaBias * 1000 + bias.matterBias * 1000) / 1000 != 1) {
		throw new Error('Bias not configured correctly');
	}
};
