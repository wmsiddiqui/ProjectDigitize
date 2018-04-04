module.exports = {
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
	},
	updateAvailableAreas(coordinates, availableAreas, regionMap) {
		//if left block is empty
		if (
			coordinates[0] > 0 &&
			!this.getBlock(regionMap, coordinates[0] - 1, coordinates[1]) &&
			!availableAreas[coordinates[0] - 1 + ',' + coordinates[1]]
		) {
			availableAreas[coordinates[0] - 1 + ',' + coordinates[1]] = [ coordinates[0] - 1, coordinates[0] ];
		}
		//right
		if (
			coordinates[0] < regionMap.length - 1 &&
			!this.getBlock(regionMap, coordinates[0] + 1, coordinates[1]) &&
			!availableAreas[coordinates[0] + 1 + ',' + coordinates[1]]
		) {
			availableAreas[coordinates[0] + 1 + ',' + coordinates[1]] = [ coordinates[0] + 1, coordinates[0] ];
		}
		//down
		if (
			coordinates[1] > 0 &&
			!this.getBlock(regionMap, coordinates[0], coordinates[1] - 1) &&
			!availableAreas[coordinates[0] + ',' + (coordinates[1] - 1)]
		) {
			availableAreas[coordinates[0] + ',' + (coordinates[1] - 1)] = [ coordinates[0], coordinates[0] - 1 ];
		}
		//up
		if (
			coordinates[1] < regionMap.length - 1 &&
			!this.getBlock(regionMap, coordinates[0], coordinates[1] - 1) &&
			!availableAreas[coordinates[0] + ',' + (coordinates[1] + 1)]
		) {
			availableAreas[coordinates[0] + ',' + (coordinates[1] + 1)] = [ coordinates[0], coordinates[0] + 1 ];
		}

		//remove the block from available areas
		if (availableAreas[coordinates[0] + ',' + coordinates[1]]) {
			delete availableAreas[coordinates[0] + ',' + coordinates[1]];
		}
	},

	getBlock(regionMap, x, y) {
		return regionMap[x][y];
	}
};
