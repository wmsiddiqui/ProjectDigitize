var Block = require('./block');
var blockTypes = require('./blockTypes');

var worldMap = [ [] ];
var availableAreas = [];
var worldSize = 11;

var remainingCapacity = worldSize * worldSize;
var saveClient;
exports.getWorldGenerator = function(blockSaver) {
	if (blockSaver && !saveClient) {
		saveClient = blockSaver;
	}
	return {
		getRemainingCapacity: function() {
			return remainingCapacity;
		},
		createBlock: function() {
			if (remainingCapacity == worldSize * worldSize && availableAreas.length == 0) {
				//First Block
				var blockType = getRandomBlockType();
			}
		},
		getBlock: function(x, y) {
			return worldMap[x][y];
		}
	};
	//var test = new Block('TestName', 10, 20, 30, 15);
};

var getRandomBlockType = function() {
	var numberOfBlockTypes = blockTypes.length;
	var randomBlockTypeId = Math.floor(Math.random() * numberOfBlockTypes) + 1;
	var randomBlockType = blockTypes[randomBlockTypeId];
	return randomBlockType;
};
