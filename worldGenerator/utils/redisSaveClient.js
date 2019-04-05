const Rejson = require('iorejson');
const instance = new Rejson();
let client = null;
let connecting = false;

const connectToClient = async () => {
	if (!client && !connecting) {
		connecting = true;
		try {
			client = await instance.connect();
		} catch (error) {
			throw new Error(`Error connecting to Redis. ${error && error.message}`);
		} finally {
			connecting = false;
		}
	}
	return client;
};

connectToClient();

module.exports = {
	async closeConnection() {
		if (client) {
			try {
				instance.client.disconnect();
			} catch (error) {
				throw new Error(`Error closing Redis client. ${error && error.message}`);
			}
		}
	},

	async getRegion(regionId) {
		checkClient();
		if (!regionId || !regionId.length) {
			throw new Error('RegionId is required to getRegion');
		}
		try {
			return await instance.get('regions', `.${regionId}`);
		} catch (error) {}
	},

	async saveRegion(region) {
		checkClient();
		try {
			const regionJson = region.toJson();
			return await instance.set('regions', `.${regionJson.id}`, regionJson);
		} catch (error) {
			throw new Error(`Error persisting region. ${error && error.message}`);
		}
	},

	async getBlock(blockId) {
		checkClient();
		if (!blockId || !blockId.length) {
			throw new Error('BlockId is required to getBlock');
		}
		try {
			return await instance.get('regions', `.${blockId}`);
		} catch (error) {
			throw new Error(`Error getting block. ${error && error.message}`);
		}
	},

	async saveNewBlock(block) {
		checkClient();
		try {
			const blockJson = block.toJson();
			return await instance.set('regions', `.${block.id}`, blockJson);
		} catch (error) {
			throw new Error(`Error creating new block. ${error.message}`);
		}
	},

	async saveBlock(block) {
		checkClient();
		try {
			const blockJson = block.toJson();
			return await instance.set('regions', `.${block.id}.resources`, blockJson.resources);
		} catch (error) {
			throw new Error(`Error persisting block. ${error && error.message}`);
		}
	}
};

const checkClient = async () => {
	if (!client && !connecting) {
		await connectToClient();
	}
};
