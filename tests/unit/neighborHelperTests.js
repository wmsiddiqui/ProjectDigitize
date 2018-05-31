var chai = require('chai');
var assert = chai.assert;
var neighborHelper = require('../../worldGenerator/utils/neighborHelper');

describe('neighborHelper', function() {
	describe('getNeighborBlocks', function() {
		it('should return a list of all the neighbors', function() {
			var regionMap = [];
			for (var i = 0; i < 3; i++) {
				regionMap[i] = [];
			}

			regionMap[0][1] = {};
			regionMap[2][1] = {};
			regionMap[1][0] = {};
			regionMap[1][2] = {};

			var neighbors = neighborHelper.getNeighborBlocks([ 1, 1 ], regionMap);
			assert.equal(neighbors.length, 4);
		});

		it('should return empty array if there are no neighbors', function() {
			var regionMap = createEmpty2dArray(3);

			var neighbors = neighborHelper.getNeighborBlocks([ 1, 1 ], regionMap);
			assert.equal(neighbors.length, 0);
		});

		it('should return a list of all the neighbors of the corner blocks', function() {
			var regionMap = createEmpty2dArray(3);

			regionMap[0] = [ {}, {}, {} ];
			regionMap[1] = [ {}, {}, {} ];
			regionMap[2] = [ {}, {}, {} ];

			var bottomLeftNeighbors = neighborHelper.getNeighborBlocks([ 0, 0 ], regionMap);
			assert.equal(bottomLeftNeighbors.length, 2);

			var topLeftNeighbors = neighborHelper.getNeighborBlocks([ 0, 2 ], regionMap);
			assert.equal(topLeftNeighbors.length, 2);

			var bottomRightNeighbors = neighborHelper.getNeighborBlocks([ 2, 0 ], regionMap);
			assert.equal(bottomRightNeighbors.length, 2);

			var topRightNeighbors = neighborHelper.getNeighborBlocks([ 2, 2 ], regionMap);
			assert.equal(topRightNeighbors.length, 2);
		});
	});

	describe('updateAvailableAreas', function() {
		it('should update available areas correctly if all other blocks are free', function() {
			var regionMap = createEmpty2dArray(3);
			var availableAreas = {};

			neighborHelper.updateAvailableAreas([ 1, 1 ], availableAreas, regionMap);

			assert.exists(availableAreas['0,1']);
			assert.exists(availableAreas['1,0']);
			assert.exists(availableAreas['1,2']);
			assert.exists(availableAreas['2,1']);
			assert.equal(Object.keys(availableAreas).length, 4);
		});

		it('should update available areas correctly when multiple blocks are added', function() {
			var regionMap = createEmpty2dArray(3);
			regionMap[1][1] = {};
			var availableAreas = {};

			neighborHelper.updateAvailableAreas([ 1, 1 ], availableAreas, regionMap);
			assert.equal(Object.keys(availableAreas).length, 4);

			neighborHelper.updateAvailableAreas([ 2, 1 ], availableAreas, regionMap);

			assert.equal(Object.keys(availableAreas).length, 5);
		});

		it('should not update available areas correctly if all other blocks are full', function() {
			var regionMap = createEmpty2dArray(3);
			regionMap[0] = [ {}, {}, {} ];
			regionMap[2] = [ {}, {}, {} ];
			regionMap[1][0] = {};
			regionMap[1][2] = {};

			var availableAreas = {};

			neighborHelper.updateAvailableAreas([ 1, 1 ], availableAreas, regionMap);

			assert.isUndefined(availableAreas['0,1']);
			assert.isUndefined(availableAreas['1,0']);
			assert.isUndefined(availableAreas['1,2']);
			assert.isUndefined(availableAreas['2,1']);

			assert.equal(Object.keys(availableAreas).length, 0);
		});

		it('should update available areas correctly corner case', function() {
			var regionMap = createEmpty2dArray(3);
			var availableAreas = {};

			neighborHelper.updateAvailableAreas([ 0, 0 ], availableAreas, regionMap);

			assert.exists(availableAreas['0,1']);
			assert.exists(availableAreas['1,0']);
			assert.equal(Object.keys(availableAreas).length, 2);
		});

		it('should remove the current block from the available areas', function() {
			var regionMap = createEmpty2dArray(3);
			var availableAreas = { '1,1': {} };

			neighborHelper.updateAvailableAreas([ 1, 1 ], availableAreas, regionMap);

			assert.isUndefined(availableAreas['1,1']);
		});
	});
});

var createEmpty2dArray = function(dimension) {
	var map = [];
	for (var i = 0; i < dimension; i++) {
		map[i] = [];
	}
	return map;
};
