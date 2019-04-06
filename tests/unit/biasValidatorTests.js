const chai = require('chai');
const assert = chai.assert;
const modulePath = '../../worldGenerator/utils/biasValidator';
const proxyquire = require('proxyquire');

describe('biasValidator', function() {
	describe('sums of biases should be validated', function() {
		const numberCheckerMock = {
			isPositiveNumber: function() {
				return true;
			},
			isNumberWithOnly3DecimalDigits: function() {
				return true;
			}
		};

		it('should throw an error if sums of biases are less than 1', function() {
			const bias = {
				etherBias: 0.1,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			const sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });

			assert.throw(function() {
				sut.validateBias(bias);
			});
		});

		it('should throw an error if sums of biases are greater than 1', function() {
			const bias = {
				etherBias: 0.7,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			const sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });

			assert.throw(function() {
				sut.validateBias(bias);
			});
		});
		it('should not throw an error if biases are correct', function() {
			const bias = {
				etherBias: 0.5,
				plasmaBias: 0.3,
				matterBias: 0.2
			};

			const sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });
			assert.doesNotThrow(function() {
				sut.validateBias(bias);
			});
		});
	});

	describe('individual biases should validated', function() {
		const bias = {
			etherBias: 0.5,
			plasmaBias: 0.3,
			matterBias: 0.2
		};

		it('should throw an error if any numberChecker indicates a bias is not a positive number', function() {
			const numberCheckerMock = {
				isPositiveNumber: function() {
					return false;
				},
				isNumberWithOnly3DecimalDigits: function() {
					return true;
				}
			};

			const sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });
			assert.throw(function() {
				sut.validateBias(bias);
			});
		});

		it('should throw an error if any numberChecker indicates a bias is a long decimal', function() {
			const numberCheckerMock = {
				isPositiveNumber: function() {
					return true;
				},
				isNumberWithOnly3DecimalDigits: function() {
					return false;
				}
			};

			const sut = proxyquire(modulePath, { './numberChecker': numberCheckerMock });
			assert.throw(function() {
				sut.validateBias(bias);
			});
		});
	});
});
