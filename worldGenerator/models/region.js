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

		//Specifies the first type of block in a region.
		if (typeSeed) {
			this._typeSeed = typeSeed;
		}

		//Initialize 2d Array
		this._regionMap = [];
		for (var i = 0; i < regionSize; i++) {
			this._regionMap[i] = [];
		}

		this._saveClient.saveRegion(this);
	}

	createBlock() {
		var block;
		var coordinates;

		var remainingCapacity = this._remainingCapacity;
		var regionSize = this._regionSize;
		var availableAreas = this._availableAreas;
		var typeSeed = this._typeSeed;
		var id = this._id;

		if (remainingCapacity == regionSize * regionSize && Object.keys(availableAreas).length == 0) {
			//First Block
			var generatedBlockType;
			if (!typeSeed) {
				generatedBlockType = blockTypeGenerator.getRandomBlockType();
			} else {
				generatedBlockType = blockTypeGenerator.getBlockTypeFromSeed(typeSeed);
			}

			var coordinateNumber = Math.floor(regionSize / 2);
			var blockInitProperties = {
				blockType: generatedBlockType
			};
			block = new Block(`${id}.${this._occupiedAreas.size}`, blockInitProperties, this._saveClient);
			coordinates = [ coordinateNumber, coordinateNumber ];
		} else {
			//Add a block
			var numberOfAvailableAreas = Object.keys(availableAreas).length;
			if (numberOfAvailableAreas == 0) {
				throw new Error('Map is full');
			}
			var randomArea = Math.floor(Math.random() * numberOfAvailableAreas);
			var areaToGenerateBlock = Object.keys(availableAreas)[randomArea];

			var neighboringBlocks = neighborHelper.getNeighborBlocks(
				availableAreas[areaToGenerateBlock],
				this._regionMap
			);
			var generatedBlockType = blockTypeGenerator.getCalculatedBlockType(neighboringBlocks);
			var blockInitProperties = {
				blockType: generatedBlockType
			};
			block = new Block(`${id}.${this._occupiedAreas.size}`, blockInitProperties, this._saveClient);
			coordinates = availableAreas[areaToGenerateBlock];
		}

		neighborHelper.updateAvailableAreas(coordinates, availableAreas, this._regionMap);

		this._occupiedAreas.add(coordinates);
		this._regionMap[coordinates[0]][coordinates[1]] = block;

		this._remainingCapacity--;
		this._saveClient.saveRegion(this);
		return block;
	}

	toJson() {
		return {
			id: this._id,
			regionSize: this._regionSize,
			remainingCapacity: this._remainingCapacity,
			regionMap: this._regionMap
		};
	}
};
