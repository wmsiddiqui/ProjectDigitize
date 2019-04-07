const Block = require('./block');
const numberChecker = require('../utils/numberChecker');
const neighborHelper = require('../utils/neighborHelper');
const BlockTypeGenerator = require('../utils/blockTypeGenerator');
let blockTypeGenerator;

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
		this._occupiedAreasCount = 0;
		this._remainingCapacity = regionSize * regionSize;

		//Specifies the first type of block in a region.
		if (typeSeed) {
			this._typeSeed = typeSeed;
		}

		//Initialize 2d Array
		this._regionMap = [];
		for (let i = 0; i < regionSize; i++) {
			this._regionMap[i] = [];
		}

		this._saveClient.saveRegion(this);
	}

	createBlock() {
		let block;
		let coordinates;

		const remainingCapacity = this._remainingCapacity;
		const regionSize = this._regionSize;
		const availableAreas = this._availableAreas;
		const typeSeed = this._typeSeed;
		const id = this._id;

		if (remainingCapacity == regionSize * regionSize && Object.keys(availableAreas).length == 0) {
			//First Block
			let generatedBlockType;
			if (!typeSeed) {
				generatedBlockType = blockTypeGenerator.getRandomBlockType();
			} else {
				generatedBlockType = blockTypeGenerator.getBlockTypeFromSeed(typeSeed);
			}

			const coordinateNumber = Math.floor(regionSize / 2);
			const blockInitProperties = {
				blockType: generatedBlockType
			};
			block = new Block(`${id}.${this._occupiedAreasCount}`, blockInitProperties, this._saveClient);
			coordinates = [ coordinateNumber, coordinateNumber ];
		} else {
			//Add a block
			const numberOfAvailableAreas = Object.keys(availableAreas).length;
			if (numberOfAvailableAreas == 0) {
				throw new Error('Map is full');
			}
			const randomArea = Math.floor(Math.random() * numberOfAvailableAreas);
			const areaToGenerateBlock = Object.keys(availableAreas)[randomArea];

			const neighboringBlocks = neighborHelper.getNeighborBlocks(
				availableAreas[areaToGenerateBlock],
				this._regionMap
			);
			const generatedBlockType = blockTypeGenerator.getCalculatedBlockType(neighboringBlocks);
			const blockInitProperties = {
				blockType: generatedBlockType
			};
			block = new Block(`${id}.${this._occupiedAreasCount}`, blockInitProperties, this._saveClient);
			coordinates = availableAreas[areaToGenerateBlock];
		}

		neighborHelper.updateAvailableAreas(coordinates, availableAreas, this._regionMap);

		this._occupiedAreasCount++;
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
