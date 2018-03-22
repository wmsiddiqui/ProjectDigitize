var blockTypes = require('../models/blockTypes');
var numberChecker = require('./numberChecker');

module.exports = {
	getCalculatedBlockType(neighboringBlocks) {
		var numberOfNeighbors = neighboringBlocks.length;

		var uniqueNeighborCorrelations = this.getUniqueNeighborCorrelations(neighboringBlocks);
		var sumPositiveCorrelations = this.getSumOfPositiveCorrelations(uniqueNeighborCorrelations);
		var uniquePositiveCorrelations = this.getPositiveCorrelations(uniqueNeighborCorrelations);

		if (sumPositiveCorrelations < 1) {
			//then get all others
		} else {
			//This is it. Roll a number and pick a type
			//How? There are n number of different block types.
			//Iterate through each one and sum. If rolled number is less than sum, continue
			//if greater, then it is the current item.
		}
	},

	getRandomBlockTypeId(uniquePositiveCorrelations) {
		var generatedType;
		var total = 0;
		var randomNumber = Math.random();
		var uniqueTypes = Object.keys(uniquePositiveCorrelations);
		for (var correlation in uniquePositiveCorrelations) {
			total = (total * 1000 + uniquePositiveCorrelations[correlation] * 1000) / 1000;
			if (randomNumber < total) {
				return correlation;
			}
		}
		throw new Error('Error calculating Block Type');
	},

	getPositiveCorrelations(uniqueNeighborCorrelations) {
		var positiveCorrelations = {};
		for (var correlation in uniqueNeighborCorrelations) {
			if (uniqueNeighborCorrelations[correlation] > 0) {
				positiveCorrelations[correlation] = uniqueNeighborCorrelations[correlation];
			}
		}
		return positiveCorrelations;
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
