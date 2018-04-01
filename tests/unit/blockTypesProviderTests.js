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
	it('should populate the Ids correctly for the blockTypes', function() {
		var mock = {
			'1': {
				name: 'Void',
				altitudeBase: 0,
				correlations: {
					'6': 0.5,
					'3': 0.5
				}
			},
			'5': {
				name: 'Ocean',
				altitudeBase: 0,
				correlations: {
					'3': -0.3,
					'5': -0.2
				}
			}
		};
		var nconfMock = getNconfMock(mock);
		var sut = proxyquire(modulePath, { nconf: nconfMock });
		var result = sut.getBlockTypes();
		assert.equal(result['1'].id, 1);
		assert.equal(result['5'].id, 5);
	});

	it('should throw an error if a specific correlation is greater than 1', function() {
		var mock = {
			'1': {
				name: 'Void',
				altitudeBase: 0,
				correlations: {
					'6': 1.2,
					'3': 0.5
				}
			}
		};
		var nconfMock = getNconfMock(mock);
		var sut = proxyquire(modulePath, { nconf: nconfMock });
		assert.throw(function() {
			sut.getBlockTypes();
		});
	});

	it('should throw an error if a specific correlation is less than -1', function() {
		var mock = {
			'1': {
				name: 'Void',
				altitudeBase: 0,
				correlations: {
					'6': -1.2,
					'3': 0.5
				}
			}
		};
		var nconfMock = getNconfMock(mock);
		var sut = proxyquire(modulePath, { nconf: nconfMock });
		assert.throw(function() {
			sut.getBlockTypes();
		});
	});

	it('should throw an error if the sum of correlations is greater than 1', function() {
		var mock = {
			'1': {
				name: 'Void',
				altitudeBase: 0,
				correlations: {
					'6': 0.8,
					'3': 0.5
				}
			}
		};
		var nconfMock = getNconfMock(mock);
		var sut = proxyquire(modulePath, { nconf: nconfMock });
		assert.throw(function() {
			sut.getBlockTypes();
		});
	});

	it('should throw an error if the sum of correlations is less than -1', function() {
		var mock = {
			'1': {
				name: 'Void',
				altitudeBase: 0,
				correlations: {
					'6': -0.8,
					'3': -0.5
				}
			}
		};
		var nconfMock = getNconfMock(mock);
		var sut = proxyquire(modulePath, { nconf: nconfMock });
		assert.throw(function() {
			sut.getBlockTypes();
		});
	});
});
