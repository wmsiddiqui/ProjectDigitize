const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const modulePath = '../../worldGenerator/utils/blockTypeGenerator';
const blockTypeGenerator = require(modulePath);
const proxyquire = require('proxyquire');
const blankBlockTypesProvider = { getBlockTypes() {} };

describe('blockTypeGenerator', function() {
	describe('getSumOfCorrelations', function() {
		it('should return 0 if all correlations are negative', function() {
			const correlations = {
				'1': -0.2,
				'2': -0.6,
				'3': -0.2
			};

			const sut = new blockTypeGenerator(blankBlockTypesProvider);
			const result = sut.getSumOfCorrelations(correlations);
			assert.equal(result, -1);
		});

		it('should return the correct sum of positive numbers and be precise to 3 decimal places', function() {
			const correlations = {
				'1': -0.201,
				'2': 0.733,
				'3': 0.2
			};

			const sut = new blockTypeGenerator(blankBlockTypesProvider);
			const result = sut.getSumOfCorrelations(correlations);
			assert.equal(result, 0.732);
		});

		it('should return 0 if there are no correlations passed in', function() {
			const sut = new blockTypeGenerator(blankBlockTypesProvider);
			const result = sut.getSumOfCorrelations();
			assert.equal(result, 0);
		});
	});
	describe('getUniqueNeighborCorrelations', function() {
		it('should return correct correlations', function() {
			const neighborBlocks = [
				{
					blockTypeId: '1'
				},
				{
					blockTypeId: '2'
				}
			];

			const blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': {
							id: 1,
							correlations: {
								3: 0.5,
								6: 0.5
							}
						},
						'2': {
							id: 2,
							correlations: {
								3: -0.3,
								6: 0.2
							}
						}
					};
				}
			};

			const sut = new blockTypeGenerator(blockTypesProviderMock);

			const result = sut.getUniqueNeighborCorrelations(neighborBlocks);
			assert.equal(result['3'], 0.2);
			assert.equal(result['6'], 0.7);
		});
	});

	describe('getPositiveCorrelations', function() {
		it('should return only positive correlations', function() {
			const uniqueCorrelations = {
				'3': 0.7,
				'5': 0.2,
				'7': -0.3,
				'6': 0
			};

			const sut = new blockTypeGenerator(blankBlockTypesProvider);
			const result = sut.getPositiveCorrelations(uniqueCorrelations);
			assert.equal(result['3'], 0.7);
			assert.equal(result['5'], 0.2);
			assert.isUndefined(result['7']);
			assert.isUndefined(result['6']);
		});
	});

	describe('getRandomBlockTypeIdFromCorrelation', function() {
		it('should return the correct block type id', function() {
			const uniqueCorrelations = {
				'3': 0.7,
				'5': 0.2,
				'7': 0.1
			};
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.85;
			});
			const sut = new blockTypeGenerator(blankBlockTypesProvider);
			const result = sut.getRandomBlockTypeIdFromCorrelation(uniqueCorrelations, 1);
			Math.random.restore();
			assert.equal(result, 5);
		});
	});

	describe('getRandomBlockType', function() {
		it('should return a valid blockType at random', function() {
			const blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': { id: 1 },
						'2': { id: 2 },
						'3': { id: 3 },
						'4': { id: 4 }
					};
				}
			};

			const sut = new blockTypeGenerator(blockTypesProviderMock);
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.7;
			});
			const result = sut.getRandomBlockType();
			Math.random.restore();
			assert.equal(result.id, 3);
		});
	});

	describe('getOtherTypeIds', function() {
		it('should return the correct ids of other blocks', function() {
			const blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': {},
						'2': {},
						'3': {},
						'4': {}
					};
				}
			};

			const uniqueCorrelations = {
				'1': {},
				'4': {}
			};

			const sut = new blockTypeGenerator(blockTypesProviderMock);
			const result = sut.getOtherTypeIds(uniqueCorrelations);
			assert.equal(result.length, 2);
		});
	});

	describe('getCalculatedBlockType', function() {
		it('should return the correct blockType when type other', function() {
			const neighborBlocks = [
				{
					blockTypeId: '1'
				},
				{
					blockTypeId: '2'
				}
			];

			const blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': {
							id: 1,
							correlations: {
								3: 0.5,
								6: 0.5
							}
						},
						'2': {
							id: 2,
							correlations: {
								3: -0.3,
								6: 0.2,
								4: 0.5
							}
						}
					};
				}
			};

			const sut = new blockTypeGenerator(blockTypesProviderMock);
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.99;
			});
			const result = sut.getCalculatedBlockType(neighborBlocks);
			Math.random.restore();

			assert.equal(result.id, '2');
		});

		it('should return the correct blockType with fixed correlation', function() {
			const neighborBlocks = [
				{
					blockTypeId: '1'
				},
				{
					blockTypeId: '2'
				}
			];

			const blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': {
							id: 1,
							correlations: {
								3: 0.5,
								5: 0.5
							}
						},
						'2': {
							id: 2,
							correlations: {
								3: -0.3,
								4: 0.5,
								5: 0.8
							}
						},
						'5': {
							id: 5,
							correlations: {
								3: -0.3,
								4: 0.5,
								5: 0.8
							}
						}
					};
				}
			};

			const sut = new blockTypeGenerator(blockTypesProviderMock);
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.99;
			});
			const result = sut.getCalculatedBlockType(neighborBlocks);
			Math.random.restore();

			assert.equal(result.id, '5');
		});
	});

	describe('getBlockTypeFromSeed', function() {
		it('should throw an error if the seed is not valid', function() {
			const blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': {
							id: 1,
							correlations: {
								3: 0.5,
								5: 0.5
							}
						}
					};
				}
			};

			const sut = new blockTypeGenerator(blockTypesProviderMock);
			assert.throws(function() {
				sut.getBlockTypeFromSeed(10);
			});
		});

		it('should return the same block type as the seed', function() {
			const blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': {
							id: 1,
							correlations: {
								3: 0.5,
								5: 0.5
							}
						}
					};
				}
			};

			const sut = new blockTypeGenerator(blockTypesProviderMock);
			const blockTypeToGenerate = sut.getBlockTypeFromSeed(1);
			assert.equal(blockTypeToGenerate.id, 1);
		});
	});
});
