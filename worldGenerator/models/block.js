var resourceRandomizer = require('../utils/resourceRandomizer');
var numberChcker = require('../utils/numberChecker');

module.exports = class Block {
	constructor(id, blockInitProperties, blockSaver) {
		var altitude = blockInitProperties.altitude;
		var numberOfResourcesToGenerate = blockInitProperties.resourceInitCount;

		//Check here

		this._bias = blockInitProperties.bias;
		this._altitude = altitude;

		this._cap = cap;
		this.getId = function() {
			return id;
		};

		if (blockInitProperties.bias) {
			setBias(bias.etherBias, bias.plasmaBias, bias.matterBias);
		}

		this._blockSaver = blockSaver;
		this._save();
	}

	setBias(etherBias, plasmaBias, matterBias) {
		var total = etherBias + plasmaBias + matterBias;
		if (etherBias + plasmaBias + matterBias == 1) {
			this._bias = {
				_etherBias: etherBias,
				_plasmaBias: plasmaBias,
				_matterBias: matterBias
			};
		}
	}

	generateResources(numberOfResources) {
		//TODO: pass in bias
	}

	consumeResources(etherUsed, plasmaUsed, matterUsed) {
		if (etherUsed <= this._ether && plasmaUsed <= this._plasma && matterUsed <= this._matter) {
			this._ether -= etherUsed;
			this._plasma -= plasmaUsed;
			this._matter -= matterUsed;
			this._save();
			return true;
		}
		return false;
	}

	_save() {
		var saveResult = this._blockSaver.saveBlock(this);
		if (!saveResult) {
			console.log('Warning: Data not persisted to database!');
		}
	}
};
