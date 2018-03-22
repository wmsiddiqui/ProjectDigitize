var chai = require('chai');
var assert = chai.assert;
var modulePath = '../../worldGenerator/utils/neighborHelper';
var neighborHelper = require(modulePath);
var proxyquire = require('proxyquire');

describe('neighborHelper', function() {
	describe('getSumOfPositiveCorrelations', function() {
		it('should return 0 if all correlations are negative', function() {
			var correlations = {
				'1': -0.2,
				'2': -0.6,
				'3': -0.2
			};

			var result = neighborHelper.getSumOfPositiveCorrelations(correlations);
			assert.equal(result, 0);
		});

		it('should return the correct sum of positive numbers and be precise to 3 decimal places', function() {
			var correlations = {
				'1': -0.201,
				'2': 0.733,
				'3': 0.2
			};

			var result = neighborHelper.getSumOfPositiveCorrelations(correlations);
			assert.equal(result, 0.933);
		});

		it('should throw an error if the correlation is not a number', function() {
			var correlations = {
				'1': 'Number',
				'2': 0.733,
				'3': 0.2
			};

			assert.throw(function() {
				neighborHelper.getSumOfPositiveCorrelations(correlations);
			});
		});

		it('should throw an error if the correlation has more than 3 decimal places', function() {
			var correlations = {
				'1': 0.05,
				'2': 0.7334,
				'3': 0.2
			};

			assert.throw(function() {
				neighborHelper.getSumOfPositiveCorrelations(correlations);
			});
		});

		it('should return 0 if there are no correlations passed in', function() {
			var result = neighborHelper.getSumOfPositiveCorrelations();
			assert.equal(result, 0);
		});
	});
	describe('getUniqueNeighborCorrelations', function() {
		it('should return correct correlations', function() {
			var neighborBlocks = [
				{
					_blockTypeId: '1'
				},
				{
					_blockTypeId: '2'
				}
			];

			var blockTypesMock = {
				'1': {
					id: 1,
					correlations: {
						3: 0.5,
						6: 0.5
					}
				},
				'2': {
					id: 2,
					correlations: {
						3: -0.3,
						6: 0.2
					}
				}
			};

			var sut = proxyquire(modulePath, { '../models/blockTypes': blockTypesMock });

			var result = sut.getUniqueNeighborCorrelations(neighborBlocks);
			assert.equal(result['3'], 0.2);
			assert.equal(result['6'], 0.7);
		});
	});

	describe('getPositiveCorrelations', function() {
		var uniqueCorrelations = {
			'3': 0.7,
			'5': 0.2,
			'7': -0.3,
			'6': 0
		};

		var result = neighborHelper.getPositiveCorrelations(uniqueCorrelations);
		assert.equal(result['3'], 0.7);
		assert.equal(result['5'], 0.2);
		assert.isUndefined(result['7']);
		assert.isUndefined(result['6']);
	});
});
