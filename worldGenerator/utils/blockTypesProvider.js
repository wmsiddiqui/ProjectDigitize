var nconf = require('nconf');
var path = 'configs/blockTypes.json';
nconf.overrides({ always: 'be this value' });
nconf.argv().env().file({ file: path });
var results;

exports.getBlockTypes = function() {
	if (!results) {
		var allBlockTypes = nconf.get('blockTypes');
		for (var blockType in allBlockTypes) {
			var currentBlock = allBlockTypes[blockType];
			var correlationsSum = 0;
			currentBlock.id = blockType;

			if (!currentBlock.correlations) {
				continue;
			}
			for (var correlation in currentBlock.correlations) {
				var currentCorrelation = currentBlock.correlations[correlation];
				if (currentCorrelation > 1 || currentCorrelation < -1) {
					throw new Error('Correlation must be between -1 and 1');
				}
				correlationsSum += currentCorrelation;
			}
			if (correlationsSum > 1 || correlationsSum < -1) {
				throw new Error('Total Correlations must be between -1 and 1');
			}
		}
		results = allBlockTypes;
	}
	return results;
};
