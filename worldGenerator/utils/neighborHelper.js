var blockTypes = require('../models/blockTypes');

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

	getSumOfCorrelations(uniqueNeighborCorrelations) {
		var sumCorrelations = 0;
		for (var correlationKey in uniqueNeighborCorrelations) {
			sumCorrelations += uniqueNeighborCorrelations[correlationKey] * 100;
		}
		return sumCorrelations / 100;
	}
};
