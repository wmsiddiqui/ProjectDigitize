var Block = require('./block');
var numberChecker = require('../utils/numberChecker');
var neighborHelper = require('../utils/neighborHelper');
var BlockTypeGenerator = require('../utils/blockTypeGenerator');
var blockTypeGenerator;

module.exports = class Region {
	constructor(id, regionSize, saveClient, blockTypesProvider, typeSeed) {
		this._id = id;
		this._saveClient = saveClient;
		this._blockTypesProvider = blockTypesProvider;

		blockTypeGenerator = new BlockTypeGenerator(blockTypesProvider);

		if (!numberChecker.isPositiveWholeNumber(regionSize) || regionSize <= 0 || regionSize > 200) {
			throw new Error('Region Size is invalid');
		}

		this._regionSize = regionSize;
		this._availableAreas = {};
		this._occupiedAreas = new Set();
		this._remainingCapacity = regionSize * regionSize;

		if (typeSeed) {
			this._typeSeed = typeSeed;
		}

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
			var generatedBlockType;
			if (!this._typeSeed) {
				generatedBlockType = blockTypeGenerator.getRandomBlockType();
			} else {
				generatedBlockType = blockTypeGenerator.getBlockTypeFromSeed(this._typeSeed);
			}

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
			if (numberOfAvailableAreas == 0) {
				throw new Error('Map is full');
			}
			var randomArea = Math.floor(Math.random() * numberOfAvailableAreas);
			var areaToGenerateBlock = Object.keys(this._availableAreas)[randomArea];

			var neighboringBlocks = neighborHelper.getNeighborBlocks(
				this._availableAreas[areaToGenerateBlock],
				this._regionMap
			);
			var generatedBlockType = blockTypeGenerator.getCalculatedBlockType(neighboringBlocks);
			var blockInitProperties = {
				altitude: 10,
				blockType: generatedBlockType
			};
			block = new Block(this._id + '-' + 1, blockInitProperties, this._saveClient);
			coordinates = this._availableAreas[areaToGenerateBlock];
		}

		neighborHelper.updateAvailableAreas(coordinates, this._availableAreas, this._regionMap);

		this._occupiedAreas.add(coordinates);
		this._regionMap[coordinates[0]][coordinates[1]] = block;

		this._remainingCapacity--;
		return block;
	}
};
