var Block = require('./block');
var blockTypes = require('./blockTypes');

var worldSize = 11;

module.exports = class Region {
	constructor(id, saveClient) {
		this._id = id;
		this._saveClient = saveClient;

		this._worldMap = [ [] ];
		this._availableAreas = [];
		this._remainingCapacity = worldSize * worldSize;
	}

	getRemainingCapacity() {
		return this._remainingCapacity;
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
