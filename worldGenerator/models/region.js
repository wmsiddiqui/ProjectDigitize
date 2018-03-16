var Block = require('./block');
var blockTypes = require('./blockTypes');
var numberChecker = require('../utils/numberChecker');

var worldSize = 11;

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
		this._remainingCapacity = worldSize * worldSize;
	}

	createBlock() {
		if (remainingCapacity == worldSize * worldSize && availableAreas.length == 0) {
			//First Block
			var blockType = getRandomBlockType();
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
