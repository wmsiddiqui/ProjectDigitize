var Rejson = require('iorejson');
var instance = new Rejson();
instance.connect();

// await instance.set('foo', '.', 'this is also a test');
// const value = await instance.get('test123', '.');
// console.log(value);
module.exports = {
	async getRegion(regionId) {},
	async saveRegion(region) {},
	async getBlock(blockId) {},

	async saveNewBlock(block) {
		try {
			var blockJson = block.toJson();
			await instance.set('regions', `.${block.id}`, blockJson);
		} catch (error) {
			throw new Error(`Error creating new block. ${error.message}`);
		}
	},

	async saveBlock(block) {
		var blockJson = block.toJson();
		try {
			await instance.set('regions', `.${block.id}.resources`, blockJson.resources);
		} catch (error) {
			throw new Error(`Error persisting block. ${error && error.message}`);
		}
	}
};
