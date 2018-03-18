var blockTypes = require('../models/blockTypes');
var numberChecker = require('./numberChecker');

module.exports = {
	getCalculatedBlockType(neighboringBlocks) {
		var numberOfNeighbors = neighboringBlocks.length;

		var uniqueNeighborCorrelations = this.getUniqueNeighborCorrelations(neighboringBlocks);
		var sumCorrelations = this.getSumOfCorrelations(uniqueNeighborCorrelations);

		var fullCorrelations = {};
		if (sumCorrelations == 1) {
			var uniqueCorrelation;
		}
		var allCorrelationTypes = Object.keys(blockTypes);
	},

	getUniqueNeighborCorrelations(neighboringBlocks) {
		var uniqueNeighborCorrelations = {};
		neighboringBlocks.forEach(function(neighborBlock) {
			if (neighborBlock._blockTypeId) {
				var blockType = blockTypes[neighborBlock._blockTypeId];
				if (blockType.correlations) {
					for (var correlation in blockType.correlations) {
						if (!uniqueNeighborCorrelations[correlation]) {
							uniqueNeighborCorrelations[correlation] = blockType.correlations[correlation];
						} else {
							uniqueNeighborCorrelations[correlation] += blockType.correlations[correlation];
						}
					}
				}
			}
		});
		return uniqueNeighborCorrelations;
	},

	getSumOfPositiveCorrelations(uniqueNeighborCorrelations) {
		var sumCorrelations = 0;
		if (!uniqueNeighborCorrelations) {
			return 0;
		}
		for (var correlationKey in uniqueNeighborCorrelations) {
			if (
				!numberChecker.isNumber(uniqueNeighborCorrelations[correlationKey]) ||
				!numberChecker.isNumberWithOnly3DecimalDigits(uniqueNeighborCorrelations[correlationKey])
			) {
				throw new Error('Correlations must be numbers with up to 3 decimal places');
			}
			if (uniqueNeighborCorrelations[correlationKey] > 0) {
				sumCorrelations += uniqueNeighborCorrelations[correlationKey] * 1000;
			}
		}
		return sumCorrelations / 1000;
	}
};
