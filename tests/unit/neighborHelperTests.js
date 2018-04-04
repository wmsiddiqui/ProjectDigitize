var chai = require('chai');
var assert = chai.assert;
var neighborHelper = require('../../worldGenerator/utils/neighborHelper');

describe('neighborHelper', function() {
	describe('getNeighborBlocks', function() {
		it('should return a list of all the neighbors', function() {
			regionMap = [];
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
			regionMap = [];
			for (var i = 0; i < 3; i++) {
				regionMap[i] = [];
			}

			var neighbors = neighborHelper.getNeighborBlocks([ 1, 1 ], regionMap);
			assert.equal(neighbors.length, 0);
		});

		it('should return a list of all the neighbors of the corner blocks', function() {
			regionMap = [];
			for (var i = 0; i < 3; i++) {
				regionMap[i] = [ {}, {}, {} ];
			}

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
});
