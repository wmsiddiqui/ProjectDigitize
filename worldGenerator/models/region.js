var Block = require('./block');
var blockTypes = require('./blockTypes');
var numberChecker = require('../utils/numberChecker');

module.exports = class Region {
	constructor(id, regionSize, saveClient) {
		this._id = id;
		this._saveClient = saveClient;

		if (!numberChecker.isPositiveWholeNumber(regionSize) || regionSize <= 0 || regionSize > 200) {
			throw new Error('Region Size is invalid');
		}

		this._regionSize = regionSize;
		this._availableAreas = {};
		this._occupiedAreas = {};
		this._remainingCapacity = regionSize * regionSize;

		//Initialize 2d Array
		this._regionMap = [];
		for (var i = 0; i < regionSize; i++) {
			this._regionMap[i] = [];
		}
	}

	createBlock() {
		var block;
		var coordinates;
		if (
			this._remainingCapacity == this._regionSize * this._regionSize &&
			Object.keys(this._availableAreas).length == 0
		) {
			//First Block
			var generatedBlockType = getRandomBlockType();
			var coordinateNumber = Math.floor(this._regionSize / 2);
			var blockInitProperties = {
				cap: 1,
				altitude: 10,
				blockType: generatedBlockType
			};
			block = new Block(this._id + '-' + 1, blockInitProperties, this._saveClient);
			coordinates = [ coordinateNumber, coordinateNumber ];
		} else {
			//Add a block
			var numberOfAvailableAreas = Object.keys(this._availableAreas).length;
			var randomArea = Math.floor(Math.random() * numberOfAvailableAreas);
			var areaToGenerateBlock = Object.keys(this._availableAreas)[randomArea];

			var neighboringBlocks = this.getNeighborBlocks(this._availableAreas[areaToGenerateBlock], this._regionMap);
			var generatedBlockType = this.getCalculatedBlockType(neighboringBlocks);
			var blockInitProperties = {
				cap: 1,
				altitude: 10,
				blockType: generatedBlockType
			};
			block = new Block(this._id + '-' + 1, blockInitProperties, this._saveClient);
			coordinates = areaToGenerateBlock;
		}

		this.updateAvailableAreas(coordinates);

		this._regionMap[coordinates[0]][coordinates[1]] = block;

		this._remainingCapacity--;
		return block;
	}
	getBlock(x, y) {
		return this._regionMap[x][y];
	}

	getNeighborBlocks(coordinates, regionMap) {
		var regionSize = regionMap.length;
		var neighborBlocks = [];
		//left
		if (coordinates[0] > 0 && regionMap[coordinates[0] - 1][coordinates[1]]) {
			neighborBlocks.push(regionMap[coordinates[0] - 1][coordinates[1]]);
		}
		//right
		if (coordinates[0] < regionSize - 1 && regionMap[coordinates[0] + 1][coordinates[1]]) {
			neighborBlocks.push(regionMap[coordinates[0] + 1][coordinates[1]]);
		}
		//down
		if (coordinates[1] > 0 && regionMap[coordinates[0]][coordinates[1] - 1]) {
			neighborBlocks.push(regionMap[coordinates[0]][coordinates[1] - 1]);
		}
		//up
		if (coordinates[1] < regionSize - 1 && regionMap[coordinates[0]][coordinates[1] + 1]) {
			neighborBlocks.push(regionMap[coordinates[0]][coordinates[1] + 1]);
		}
		return neighborBlocks;
	}

	getCalculatedBlockType(neighboringBlocks) {
		var numberOfNeighbors = neighboringBlocks.length;
		var neighborCorrelations = {};
		neighboringBlocks.forEach(function(neighborBlock) {
			if (neighborBlock._blockTypeId) {
				var blockType = blockTypes[neighborBlock._blockTypeId];
				if (blockType.correlations) {
					var correlationIds = Object.keys(blockType.correlations);
					correlationIds.forEach(function(correlation) {
						if (!neighborCorrelations[correlation]) {
							neighborCorrelations[correlation] = blockType.correlations[correlation];
						} else {
							neighborCorrelations[correlation] += blockType.correlations[correlation];
						}
					});
				}
			}
		});
	}

	updateAvailableAreas(coordinates) {
		//if left block is empty
		if (
			coordinates[0] > 0 &&
			!this.getBlock(coordinates[0] - 1, coordinates[1]) &&
			!this._availableAreas[coordinates[0] - 1 + ',' + coordinates[1]]
		) {
			this._availableAreas[coordinates[0] - 1 + ',' + coordinates[1]] = [ coordinates[0] - 1, coordinates[0] ];
		}
		//right
		if (
			coordinates[0] < this._regionSize - 1 &&
			!this.getBlock(coordinates[0] + 1, coordinates[1]) &&
			!this._availableAreas[coordinates[0] + 1 + ',' + coordinates[1]]
		) {
			this._availableAreas[coordinates[0] + 1 + ',' + coordinates[1]] = [ coordinates[0] + 1, coordinates[0] ];
		}
		//down
		if (
			coordinates[1] > 0 &&
			!this.getBlock(coordinates[0], coordinates[1] - 1) &&
			!this._availableAreas[coordinates[0] + ',' + (coordinates[1] - 1)]
		) {
			this._availableAreas[coordinates[0] + ',' + (coordinates[1] - 1)] = [ coordinates[0], coordinates[0] - 1 ];
		}
		//up
		if (
			coordinates[1] < this._regionSize - 1 &&
			!this.getBlock(coordinates[0], coordinates[1] - 1) &&
			!this._availableAreas[coordinates[0] + ',' + (coordinates[1] + 1)]
		) {
			this._availableAreas[coordinates[0] + ',' + (coordinates[1] + 1)] = [ coordinates[0], coordinates[0] + 1 ];
		}

		//remove the block from available areas
		if (this._availableAreas[coordinates[0] + ',' + coordinates[1]]) {
			delete this._availableAreas[coordinates[0] + ',' + coordinates[1]];
		}
	}
};

var getRandomBlockType = function() {
	var numberOfBlockTypes = Object.keys(blockTypes).length;
	var randomBlockTypeId = Math.floor(Math.random() * numberOfBlockTypes) + 1;
	var randomBlockType = blockTypes[randomBlockTypeId];
	return randomBlockType;
};
