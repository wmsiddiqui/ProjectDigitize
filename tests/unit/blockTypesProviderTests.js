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
	it('should throw an error if sum of correlations are greater than 1 for any type', function() {
		var mock = {
			'1': {
				name: 'Void',
				bias: {
					etherBias: 1,
					plasmaBias: 0,
					matterBias: 0
				},
				altitudeBase: 0,
				correlations: {
					'6': 0.5,
					'3': 0.5
				}
			},
			'2': {
				name: 'Ocean',
				bias: {
					etherBias: 0.2,
					plasmaBias: 0.8,
					matterBias: 0
				},
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
	});
});
