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
		this._availableAreas = [];
		this._remainingCapacity = regionSize * regionSize;

		//Initialize 2d Array
		this._regionMap = [];
		for (var i = 0; i < regionSize; i++) {
			this._regionMap[i] = [];
		}
	}

	createBlock() {
		var block;
		if (this._remainingCapacity == this._regionSize * this._regionSize && this._availableAreas.length == 0) {
			//First Block
			var generatedBlockType = getRandomBlockType();
			var coordinate = Math.ceil(this._regionSize / 2);
			var blockInitProperties = {
				cap: 1,
				altitude: 10,
				blockType: generatedBlockType
			};
			block = new Block(this._id + '-' + 1, blockInitProperties, this._saveClient);
			this._regionMap[coordinate - 1][coordinate - 1] = block;
		}

		//check to see if neighbors are inside region
		//if()
		this._remainingCapacity--;
		return block;
	}
	getBlock(x, y) {
		return this._regionMap[x][y];
	}
};

var getRandomBlockType = function() {
	var numberOfBlockTypes = blockTypes.length;
	var randomBlockTypeId = Math.floor(Math.random() * numberOfBlockTypes) + 1;
	var randomBlockType = blockTypes[randomBlockTypeId];
	return randomBlockType;
};
