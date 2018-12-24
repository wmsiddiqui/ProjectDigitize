var Rejson = require('iorejson');
var instance = new Rejson();

module.exports = {
	async closeConnection() {
		instance.client.disconnect();
	},
	async getRegion(regionId) {},
	async saveRegion(region) {},
	async getBlock(blockId) {},

	async saveNewBlock(block) {
		try {
			var blockJson = block.toJson();
			return await instance.set('foo', '.', blockJson);

			//return await instance.set('regions', `.${block.id}`, blockJson);
		} catch (error) {
			throw new Error(`Error creating new block. ${error.message}`);
		}
	},

	async saveBlock(block) {
		await instance.connect();

		var blockJson = block.toJson();
		try {
			return await instance.set('regions', '.', blockJson.resources);
		} catch (error) {
			throw new Error(`Error persisting block. ${error && error.message}`);
		}
	}
};
