var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var modulePath = '../../worldGenerator/utils/blockTypeGenerator';
var neighborHelper = require(modulePath);
var proxyquire = require('proxyquire');

describe('blockTypeGenerator', function() {
	describe('getSumOfCorrelations', function() {
		it('should return 0 if all correlations are negative', function() {
			var correlations = {
				'1': -0.2,
				'2': -0.6,
				'3': -0.2
			};

			var result = neighborHelper.getSumOfCorrelations(correlations);
			assert.equal(result, -1);
		});

		it('should return the correct sum of positive numbers and be precise to 3 decimal places', function() {
			var correlations = {
				'1': -0.201,
				'2': 0.733,
				'3': 0.2
			};

			var result = neighborHelper.getSumOfCorrelations(correlations);
			assert.equal(result, 0.732);
		});

		it('should return 0 if there are no correlations passed in', function() {
			var result = neighborHelper.getSumOfCorrelations();
			assert.equal(result, 0);
		});
	});
	describe('getUniqueNeighborCorrelations', function() {
		it('should return correct correlations', function() {
			var neighborBlocks = [
				{
					blockTypeId: '1'
				},
				{
					blockTypeId: '2'
				}
			];

			var blockTypesProviderMock = {
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

			var sut = proxyquire(modulePath, { '../utils/blockTypesProvider': blockTypesProviderMock });

			var result = sut.getUniqueNeighborCorrelations(neighborBlocks);
			assert.equal(result['3'], 0.2);
			assert.equal(result['6'], 0.7);
		});
	});

	describe('getPositiveCorrelations', function() {
		it('should return only positive correlations', function() {
			var uniqueCorrelations = {
				'3': 0.7,
				'5': 0.2,
				'7': -0.3,
				'6': 0
			};

			var result = neighborHelper.getPositiveCorrelations(uniqueCorrelations);
			assert.equal(result['3'], 0.7);
			assert.equal(result['5'], 0.2);
			assert.isUndefined(result['7']);
			assert.isUndefined(result['6']);
		});
	});

	describe('getRandomBlockTypeIdFromCorrelation', function() {
		it('should return the correct block type id', function() {
			var uniqueCorrelations = {
				'3': 0.7,
				'5': 0.2,
				'7': 0.1
			};
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.85;
			});
			var result = neighborHelper.getRandomBlockTypeIdFromCorrelation(uniqueCorrelations, 1);
			Math.random.restore();
			assert.equal(result, 5);
		});
	});

	describe('getRandomBlockType', function() {
		it('should return a valid blockType at random', function() {
			var blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': { id: 1 },
						'2': { id: 2 },
						'3': { id: 3 },
						'4': { id: 4 }
					};
				}
			};

			var sut = proxyquire(modulePath, { '../utils/blockTypesProvider': blockTypesProviderMock });
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.7;
			});
			var result = sut.getRandomBlockType();
			Math.random.restore();
			assert.equal(result.id, 3);
		});
	});

	describe('getOtherTypeIds', function() {
		it('should return the correct ids of other blocks', function() {
			var blockTypesProviderMock = {
				getBlockTypes: function() {
					return {
						'1': {},
						'2': {},
						'3': {},
						'4': {}
					};
				}
			};

			var uniqueCorrelations = {
				'1': {},
				'4': {}
			};

			var sut = proxyquire(modulePath, { '../utils/blockTypesProvider': blockTypesProviderMock });
			var result = sut.getOtherTypeIds(uniqueCorrelations);
			assert.equal(result.length, 2);
		});
	});

	describe('getCalculatedBlockType', function() {
		it('should return the correct blockType when type other', function() {
			var neighborBlocks = [
				{
					blockTypeId: '1'
				},
				{
					blockTypeId: '2'
				}
			];

			var blockTypesProviderMock = {
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

			var sut = proxyquire(modulePath, { '../utils/blockTypesProvider': blockTypesProviderMock });
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.99;
			});
			var result = sut.getCalculatedBlockType(neighborBlocks);
			Math.random.restore();

			assert.equal(result.id, '2');
		});

		it('should return the correct blockType with fixed correlation', function() {
			var neighborBlocks = [
				{
					blockTypeId: '1'
				},
				{
					blockTypeId: '2'
				}
			];

			var blockTypesProviderMock = {
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

			var sut = proxyquire(modulePath, { '../utils/blockTypesProvider': blockTypesProviderMock });
			sinon.stub(Math, 'random').callsFake(function() {
				return 0.99;
			});
			var result = sut.getCalculatedBlockType(neighborBlocks);
			Math.random.restore();

			assert.equal(result.id, '5');
		});
	});

	describe('getBlockTypeFromSeed', function() {
		it('should validate that the seed is valid', function() {
			var blockTypesProviderMock = {
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

			var sut = proxyquire(modulePath, { '../utils/blockTypesProvider': blockTypesProviderMock });
			assert.throws(function() {
				sut.getBlockTypeFromSeed(10);
			});
		});
	});
});
