var chai = require('chai');
var assert = chai.assert;
var numberChecker = require('../../worldGenerator/utils/numberChecker');

describe('number checker', function() {
	describe('isNumber test', function() {
		it('should return true if argument is a number', function() {
			var result = numberChecker.isNumber(10.1);
			assert.isTrue(result, 'Argument is a number, should return true');
		});
		it('should return false if argument is not a number', function() {
			var result = numberChecker.isNumber('ABC');
			assert.isFalse(result, 'Argument is not a number, should return false');
		});
		it('should return false if argument is string number', function() {
			var result = numberChecker.isNumber('10');
			assert.isFalse(result, 'Argument is not a number, should return false');
		});
	});

	describe('isWholeNumber test', function() {
		it('should return true if argument is a whole number', function() {
			var result = numberChecker.isWholeNumber(-10);
			assert.isTrue(result, 'Argument is a whole number, should be true');
		});
		it('should return false if argument is not a whole number', function() {
			var result = numberChecker.isWholeNumber(10.1);
			assert.isFalse(result, 'Argument is not a whole number, should be false');
		});
	});

	describe('isPositiveWholeNumber test', function() {
		it('should return true if argument is a positive whole number', function() {
			var result = numberChecker.isPositiveWholeNumber(10);
			assert.isTrue(result, 'Argument is a positive whole number, should be true');
		});
		it('should return false if argument is not a positive number', function() {
			var result = numberChecker.isPositiveWholeNumber(-10);
			assert.isFalse(result, 'Argument is not a positive number, should be false');
		});
	});

	describe('isPositiveNumber test', function() {
		it('should return true if argument is a positive number', function() {
			var result = numberChecker.isPositiveNumber(0.1);
			assert.isTrue(result, 'Argument is a positive number, should be true');
		});
		it('should return false if argument is not a positive number', function() {
			var result = numberChecker.isPositiveNumber(-0.1);
			assert.isFalse(result, 'Argument is not a positive number, should be false');
		});
	});

	describe('isNumberWithOnly3DecimalDigits test', function() {
		it('should return true if argument is a number with 3 decimal places', function() {
			var result = numberChecker.isNumberWithOnly3DecimalDigits(3.333);
			assert.isTrue(result, 'Argument has only 3 decimal places, should be true');
		});

		it('should return true if argument is a number with 2 decimal places', function() {
			var result = numberChecker.isNumberWithOnly3DecimalDigits(3.33);
			assert.isTrue(result, 'Argument has only 2 decimal places, should be true');
		});

		it('should return false if argument is a number with 4 decimal places', function() {
			var result = numberChecker.isNumberWithOnly3DecimalDigits(3.3333);
			assert.isFalse(result, 'Argument has 4 decimal places, should be false');
		});
	});
});
