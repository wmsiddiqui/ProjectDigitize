var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var modulePath = '../../worldGenerator/utils/blockTypesProvider';
var proxyquire = require('proxyquire');

var getNconfMock = function(getResponse) {
	return {
		overrides: function() {
			return;
		},
		get: function() {
			return getResponse;
		},
		argv: function() {
			return {
				env: function() {
					return {
						file: function() {
							return;
						}
					};
				}
			};
		}
	};
};

describe('getBlockTypes', function() {
	describe('correlation checks', function() {
		var biasValidatorMock = {
			validateBias: function() {
				return;
			}
		};

		it('should populate the Ids correctly for the blockTypes', function() {
			var mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': 0.5,
						'3': 0.5
					}
				},
				'5': {
					name: 'Ocean',
					correlations: {
						'3': -0.3,
						'5': -0.2
					}
				}
			};
			var nconfMock = getNconfMock(mock);
			var sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			var result = sut.getBlockTypes();
			assert.equal(result['1'].id, 1);
			assert.equal(result['5'].id, 5);
		});

		it('should throw an error if a specific correlation is greater than 1', function() {
			var mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': 1.2,
						'3': 0.5
					}
				}
			};
			var nconfMock = getNconfMock(mock);
			var sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function() {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if a specific correlation is less than -1', function() {
			var mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': -1.2,
						'3': 0.5
					}
				}
			};
			var nconfMock = getNconfMock(mock);
			var sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function() {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if the sum of correlations is greater than 1', function() {
			var mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': 0.8,
						'3': 0.5
					}
				}
			};
			var nconfMock = getNconfMock(mock);
			var sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function() {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if the sum of correlations is less than -1', function() {
			var mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': -0.8,
						'3': -0.5
					}
				}
			};
			var nconfMock = getNconfMock(mock);
			var sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function() {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if the correlation is not a number', function() {
			var mock = {
				'1': {
					name: 'Void',
					correlations: {
						'1': 'Number',
						'2': 0.733,
						'3': 0.2
					}
				}
			};
			var nconfMock = getNconfMock(mock);
			var sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });

			assert.throw(function() {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if the correlation has more than 3 decimal places', function() {
			var mock = {
				'1': {
					name: 'Void',
					correlations: {
						'1': 0.05,
						'2': 0.7334,
						'3': 0.2
					}
				}
			};
			var nconfMock = getNconfMock(mock);
			var sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });

			assert.throw(function() {
				sut.getBlockTypes();
			});
		});
	});
});
