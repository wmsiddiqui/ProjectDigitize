const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const modulePath = '../../worldGenerator/utils/blockTypesProvider';
const proxyquire = require('proxyquire');

const getNconfMock = function (getResponse) {
	return {
		overrides: function () {
			return;
		},
		get: function () {
			return getResponse;
		},
		argv: function () {
			return {
				env: function () {
					return {
						file: function () {
							return;
						}
					};
				}
			};
		}
	};
};

describe('getBlockTypes', function () {
	const biasValidatorMock = {
		validateBias: function () {
			return;
		}
	};

	describe('correlation checks', function () {

		it('should populate the Ids correctly for the blockTypes', function () {
			const mock = {
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
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			const result = sut.getBlockTypes();
			assert.equal(result['1'].id, 1);
			assert.equal(result['5'].id, 5);
		});

		it('should throw an error if a specific correlation is greater than 1', function () {
			const mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': 1.2,
						'3': 0.5
					}
				}
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if a specific correlation is less than -1', function () {
			const mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': -1.2,
						'3': 0.5
					}
				}
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if the sum of correlations is greater than 1', function () {
			const mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': 0.8,
						'3': 0.5
					}
				}
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if the sum of correlations is less than -1', function () {
			const mock = {
				'1': {
					name: 'Void',
					correlations: {
						'6': -0.8,
						'3': -0.5
					}
				}
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if the correlation is not a number', function () {
			const mock = {
				'1': {
					name: 'Void',
					correlations: {
						'1': 'Number',
						'2': 0.733,
						'3': 0.2
					}
				}
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });

			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw an error if the correlation has more than 3 decimal places', function () {
			const mock = {
				'1': {
					name: 'Void',
					correlations: {
						'1': 0.05,
						'2': 0.7334,
						'3': 0.2
					}
				}
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });

			assert.throw(function () {
				sut.getBlockTypes();
			});
		});
	});

	describe('selfAffinity checks', function () {
		it('should not throw if selfAffinity is valid', function () {
			const mock = {
				'1': { name: 'Plains', selfAffinity: 0.5 }
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.doesNotThrow(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw if selfAffinity is greater than 1', function () {
			const mock = {
				'1': { name: 'Plains', selfAffinity: 1.1 }
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw if selfAffinity is negative', function () {
			const mock = {
				'1': { name: 'Plains', selfAffinity: -0.1 }
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw if selfAffinity has more than 3 decimal places', function () {
			const mock = {
				'1': { name: 'Plains', selfAffinity: 0.1234 }
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should throw if selfAffinity + positive correlations exceed 1', function () {
			const mock = {
				'1': {
					name: 'Void',
					selfAffinity: 0.5,
					correlations: { '6': 0.5, '3': 0.5 }
				}
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.throw(function () {
				sut.getBlockTypes();
			});
		});

		it('should not throw if selfAffinity + negative correlations are within budget', function () {
			const mock = {
				'1': {
					name: 'Ocean',
					selfAffinity: 0.5,
					correlations: { '3': -0.3, '5': -0.2 }
				}
			};
			const nconfMock = getNconfMock(mock);
			const sut = proxyquire(modulePath, { nconf: nconfMock, './biasValidator': biasValidatorMock });
			assert.doesNotThrow(function () {
				sut.getBlockTypes();
			});
		});
	});
});
