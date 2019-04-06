const numberChecker = require('./numberChecker');

let blockTypes;

module.exports = class BlockTypeGenerator {
	constructor(blockTypesProvider) {
		blockTypes = blockTypesProvider.getBlockTypes();
	}

	getCalculatedBlockType(neighboringBlocks) {
		const numberOfNeighbors = neighboringBlocks.length;

		const uniqueNeighborCorrelations = this.getUniqueNeighborCorrelations(neighboringBlocks);
		const uniquePositiveCorrelations = this.getPositiveCorrelations(uniqueNeighborCorrelations);
		const sumPositiveCorrelations = this.getSumOfCorrelations(uniquePositiveCorrelations);
		let blockTypeIdToGenerate;

		if (sumPositiveCorrelations < numberOfNeighbors) {
			//If the sum of positive correlations is less than 1, there is a chance that the block
			//generated is an "other" type. An "other" type is a block type that is not part of the
			//uniqueNeighborCorrelations collection of correlations. This ensures that if a neighbor
			//block has a negative correlation with a block type, it makes it so the type generated
			//is less likely to be generated. This allows for negative correlations, and if negative
			//enough, can make it impossible for two specific blocks to be generated next to each other

			const randomBlockTypeId = this.getRandomBlockTypeIdFromCorrelation(
				uniquePositiveCorrelations,
				numberOfNeighbors,
				true
			);
			if (randomBlockTypeId == 0) {
				const others = this.getOtherTypeIds(uniqueNeighborCorrelations);
				const otherTypePicked = this.getRandomBlockTypeId(others);
				blockTypeIdToGenerate = otherTypePicked;
			} else {
				blockTypeIdToGenerate = randomBlockTypeId;
			}
		} else {
			//If the correlations total 1, then the
			blockTypeIdToGenerate = this.getRandomBlockTypeIdFromCorrelation(
				uniquePositiveCorrelations,
				numberOfNeighbors,
				false
			);
		}

		const blockTypeToGenerate = blockTypes[blockTypeIdToGenerate];
		if (!blockTypeToGenerate) {
			throw new Error('Invalid blockTypes configuration');
		}

		return blockTypeToGenerate;
	}

	getBlockTypeFromSeed(seed) {
		const blockTypeToGenerate = blockTypes[seed];
		if (!blockTypeToGenerate) {
			throw new Error('Invalid Seed');
		}
		return blockTypeToGenerate;
	}

	getOtherTypeIds(uniqueCorrelations) {
		if (!uniqueCorrelations) {
			throw new Error('Invalid Correlations');
		}
		let otherTypes = [];
		for (let blockType in blockTypes) {
			if (!uniqueCorrelations[blockType]) {
				otherTypes.push(blockType);
			}
		}

		if (otherTypes.length == 0) {
			throw new Error('No other block types remain');
		}
		return otherTypes;
	}

	getRandomBlockTypeIdFromCorrelation(uniquePositiveCorrelations, numberOfNeighbors, includeOther = false) {
		let total = 0;
		const randomNumber = Math.random() * numberOfNeighbors;
		for (let correlation in uniquePositiveCorrelations) {
			total = (total * 1000 + uniquePositiveCorrelations[correlation] * 1000) / 1000;
			if (randomNumber < total) {
				return correlation;
			}
		}
		if (includeOther) {
			return 0;
		}
		throw new Error('Error calculating Block Type');
	}

	getRandomBlockTypeId(blockTypeIds) {
		let numberOfTypes = blockTypeIds.length;
		let indexOfType = Math.floor(Math.random() * numberOfTypes);
		return blockTypeIds[indexOfType];
	}

	getRandomBlockType() {
		let allIds = Object.keys(blockTypes);
		let indexOfType = Math.floor(Math.random() * allIds.length);
		let idOfType = allIds[indexOfType];
		return blockTypes[idOfType];
	}

	getPositiveCorrelations(uniqueNeighborCorrelations) {
		var positiveCorrelations = {};
		for (var correlation in uniqueNeighborCorrelations) {
			if (uniqueNeighborCorrelations[correlation] > 0) {
				positiveCorrelations[correlation] = uniqueNeighborCorrelations[correlation];
			}
		}
		return positiveCorrelations;
	}

	getUniqueNeighborCorrelations(neighboringBlocks) {
		var uniqueNeighborCorrelations = {};
		neighboringBlocks.forEach(function(neighborBlock) {
			if (neighborBlock.blockTypeId) {
				var blockType = blockTypes[neighborBlock.blockTypeId];
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
	}

	getSumOfCorrelations(uniqueNeighborCorrelations) {
		var sumCorrelations = 0;
		if (!uniqueNeighborCorrelations) {
			return 0;
		}
		for (var correlationKey in uniqueNeighborCorrelations) {
			sumCorrelations += uniqueNeighborCorrelations[correlationKey] * 1000;
		}
		return sumCorrelations / 1000;
	}
};
