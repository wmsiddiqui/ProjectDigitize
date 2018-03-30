var blockTypesProvider = require('../utils/blockTypesProvider');
var numberChecker = require('./numberChecker');

module.exports = {
	getCalculatedBlockType(neighboringBlocks) {
		var numberOfNeighbors = neighboringBlocks.length;

		var uniqueNeighborCorrelations = this.getUniqueNeighborCorrelations(neighboringBlocks);
		var uniquePositiveCorrelations = this.getPositiveCorrelations(uniqueNeighborCorrelations);
		var sumPositiveCorrelations = this.getSumOfCorrelations(uniquePositiveCorrelations);
		var blockTypeToGenerate;

		//This logic will not work. How will sum be 1 if there are multiple neighbors. Need to divide
		//by the number of neighbors
		if (sumPositiveCorrelations < 1) {
			//If the sum of positive correlations is less than 1, there is a chance that the block
			//generated is an "other" type. An "other" type is a block type that is not part of the
			//uniqueNeighborCorrelations collection of correlations. This ensures that if a neighbor
			//block has a negative correlation with a block type, it makes it so the type generated
			//is less likely to be generated. This allows for negative correlations, and if negative
			//enough, can make it impossible for two specific blocks to be generated next to each other

			var randomBlockTypeId = this.getRandomBlockTypeIdFromCorrelation(uniquePositiveCorrelations);
			if (randomBlockTypeId == 0) {
				var others = this.getOtherTypeIds(uniqueNeighborCorrelations);
				var otherTypePicked = this.getRandomBlockTypeId(others);
				blockTypeToGenerate = otherTypePicked;
			} else {
				blockTypeToGenerate = randomBlockTypeId;
			}
		} else {
			//If the correlations total 1, then the
			blockTypeToGenerate = this.getRandomBlockTypeIdFromCorrelation(uniquePositiveCorrelations);
		}
	},

	getOtherTypeIds(uniqueCorrelations) {
		if (!uniqueCorrelations) {
			throw new Error('Invalid Correlations');
		}
		var otherTypes = [];
		var blockTypes = blockTypesProvider.getBlockTypes();
		for (var blockType in blockTypes) {
			if (!uniqueCorrelations[blockType]) {
				otherTypes.push(blockType);
			}
		}

		if (otherTypes.length == 0) {
			throw new Error('No other block types remain');
		}
		return otherTypes;
	},

	getRandomBlockTypeIdFromCorrelation(uniquePositiveCorrelations, includeOther = false) {
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
		if (includeOther) {
			return 0;
		}
		throw new Error('Error calculating Block Type');
	},

	getRandomBlockTypeId(blockTypeIds) {
		var numberOfTypes = blockTypeIds.length;
		var result = Math.floor(Math.random() * numberOfTypes);
		return result;
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
		var blockTypes = blockTypesProvider.getBlockTypes();
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
			sumCorrelations += uniqueNeighborCorrelations[correlationKey] * 1000;
		}
		return sumCorrelations / 1000;
	}
};
