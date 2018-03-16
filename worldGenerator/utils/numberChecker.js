module.exports = {
	isNumber(number) {
		if (Number(number) === number) {
			return true;
		}
		return false;
	},
	isWholeNumber(number) {
		if (this.isNumber(number) && number % 1 === 0) {
			return true;
		}
		return false;
	},
	isPositiveWholeNumber(number) {
		if (this.isNumber(number) && this.isWholeNumber(number) && number >= 0) {
			return true;
		}
		return false;
	},
	isPositiveNumber(number) {
		if (this.isNumber(number) && number >= 0) {
			return true;
		}
		return false;
	},
	isNumberWithOnly3DecimalDigits(number) {
		var truncatedNumber = Math.trunc(number * 1000);
		if (number * 1000 > truncatedNumber) {
			return false;
		}
		return true;
	}
};
