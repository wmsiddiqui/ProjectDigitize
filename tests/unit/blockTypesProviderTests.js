var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var modulePath = '../../worldGenerator/utils/blockTypesProvider';
var blockTypesProvider = require(modulePath);
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
		var sut = proxyquire(modulePath, { nconf: nconfMock });
	});
});
