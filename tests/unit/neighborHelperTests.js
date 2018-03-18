var chai = require('chai');
var assert = chai.assert;
var neighborHelper = require('../../worldGenerator/utils/neighborHelper');

describe('neighborHelper', function() {
	describe('getSumOfCorrelations', function() {
		it('should return the correct sum if negative numbers', function() {
			var correlations = {
				'1': -0.2,
				'2': -0.6,
				'3': -0.2
			};

			var result = neighborHelper.getSumOfCorrelations(correlations);
			assert.equal(result, -1);
		});

		it('should return the correct sum and be precise to 3 decimal places', function() {
			var correlations = {
				'1': -0.201,
				'2': 0.733,
				'3': 0.2
			};

			var result = neighborHelper.getSumOfCorrelations(correlations);
			assert.equal(result, 0.732);
		});

		it('should throw an error if the correlation is not a number', function() {
			var correlations = {
				'1': 'Number',
				'2': 0.733,
				'3': 0.2
			};

			assert.throw(function() {
				neighborHelper.getSumOfCorrelations(correlations);
			});
		});

		it('should throw an error if the correlation has more than 3 decimal places', function() {
			var correlations = {
				'1': 0.05,
				'2': 0.7334,
				'3': 0.2
			};

			assert.throw(function() {
				neighborHelper.getSumOfCorrelations(correlations);
			});
		});

		it('should return 0 if there are no correlations passed in', function() {
			var result = neighborHelper.getSumOfCorrelations();
			assert.equal(result, 0);
		});
	});
});
