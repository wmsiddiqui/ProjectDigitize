module.exports = {
	isNumber: function(number) {
		if (Number(number) === number) {
			return true;
		}
		return false;
	},
	isWholeNumber: function(number) {
		if (this.isNumber(number) && number % 1 === 0) {
			return true;
		}
		return false;
	},
	isPositiveWholeNumber: function(number) {
		if (this.isNumber(number) && this.isWholeNumber(number) && number > 0) {
			return true;
		}
		return false;
	},
	isPositiveNumber: function(number) {
		if (this.isNumber(number) && number > 0) {
			return true;
		}
		return false;
	}
};
