var Block = require('./block');
var blockTypesProvider = require('../utils/blockTypesProvider');
var numberChecker = require('../utils/numberChecker');
var neighborHelper = require('../utils/neighborHelper');

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

			var neighboringBlocks = neighborHelper.getNeighborBlocks(
				this._availableAreas[areaToGenerateBlock],
				this._regionMap
			);
			var generatedBlockType = getRandomBlockType(neighboringBlocks);
			var blockInitProperties = {
				altitude: 10,
				blockType: generatedBlockType
			};
			block = new Block(this._id + '-' + 1, blockInitProperties, this._saveClient);
			coordinates = areaToGenerateBlock;
		}

		neighborHelper.updateAvailableAreas(coordinates, this._availableAreas, this._regionMap);

		this._regionMap[coordinates[0]][coordinates[1]] = block;

		this._remainingCapacity--;
		return block;
	}
};

var getRandomBlockType = function() {
	var blockTypes = blockTypesProvider.getBlockTypes();
	var numberOfBlockTypes = Object.keys(blockTypes).length;
	var randomBlockTypeId = Math.floor(Math.random() * numberOfBlockTypes) + 1;
	var randomBlockType = blockTypes[randomBlockTypeId];
	return randomBlockType;
};
