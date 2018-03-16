var chai = require('chai');
var assert = chai.assert;
var worldGenerator = require('../../worldGenerator/models/worldGenerator');

xdescribe('world generator', function() {
	it('should be a singleton', function() {
		var gen1 = worldGenerator();

		gen1.decrementCapacity();

		var gen2 = worldGenerator();
		gen2.decrementCapacity();

		console.log(gen1.getCapacity());
		console.log(gen2.getCapacity());
	});
	it('should return a random block type', function() {
		var generator = worldGenerator();
	});
});
