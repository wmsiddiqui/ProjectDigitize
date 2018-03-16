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
		this._regionMap = [ [] ];
		this._availableAreas = [];
		this._remainingCapacity = regionSize * regionSize;
	}

	createBlock() {
		if (this._remainingCapacity == this._regionSize * this._regionSize && this._availableAreas.length == 0) {
			//First Block
			var generatedBlockType = getRandomBlockType();
			var coordinate = Math.ceil(this._regionSize / 2);
			var blockInitProperties = {
				cap: 1,
				altitude: 10,
				blockType: generatedBlockType
			};
			var block = new Block(1, blockInitProperties, this._saveClient);
			return block;
		}
	}
	getBlock(x, y) {
		return this._worldMap[x][y];
	}
};
//var test = new Block('TestName', 10, 20, 30, 15);

var getRandomBlockType = function() {
	var numberOfBlockTypes = blockTypes.length;
	var randomBlockTypeId = Math.floor(Math.random() * numberOfBlockTypes) + 1;
	var randomBlockType = blockTypes[randomBlockTypeId];
	return randomBlockType;
};
