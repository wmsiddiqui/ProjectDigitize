var chai = require('chai');
var assert = chai.assert;
var modulePath = '../../worldGenerator/utils/biasValidator';
var proxyquire = require('proxyquire');

describe('biasValidator', function() {
	describe('sums of biases should be validated', function() {
		var numberCheckerMock = {
			isPositiveNumber: function() {
				return true;
			},
			isNumberWithOnly3DecimalDigits: function() {
				return true;
			}
		};

		it('should throw an error if sums of biases are less than 1', function() {
			var bias = {
				etherBias: 0.1,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			var sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });

			assert.throw(function() {
				sut.validateBias(bias);
			});
		});

		it('should throw an error if sums of biases are greater than 1', function() {
			var bias = {
				etherBias: 0.7,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			var sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });

			assert.throw(function() {
				sut.validateBias(bias);
			});
		});
		it('should not throw an error if biases are correct', function() {
			var bias = {
				etherBias: 0.5,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			var sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });
			assert.doesNotThrow(function() {
				sut.validateBias(bias);
			});
		});
	});

	describe('individual biases should validated', function() {
		var bias = {
			etherBias: 0.5,
			plasmaBias: 0.3,
			matterBias: 0.2
		};

		it('should throw an error if any numberChecker indicates a bias is not a positive number', function() {
			var numberCheckerMock = {
				isPositiveNumber: function() {
					return false;
				},
				isNumberWithOnly3DecimalDigits: function() {
					return true;
				}
			};

			var sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });
			assert.throw(function() {
				sut.validateBias(bias);
			});
		});

		it('should throw an error if any numberChecker indicates a bias is a long decimal', function() {
			var numberCheckerMock = {
				isPositiveNumber: function() {
					return true;
				},
				isNumberWithOnly3DecimalDigits: function() {
					return false;
				}
			};

			var sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });
			assert.throw(function() {
				sut.validateBias(bias);
			});
		});
	});
});
