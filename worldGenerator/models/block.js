var resourceRandomizer = require('../utils/resourceRandomizer');

module.exports = class Block {
	constructor(id, blockInitProperties, blockSaver) {
		var altitude = blockInitProperties.altitude;
		var ether = blockInitProperties.ether;
		var plasma = blockInitProperties.plasma;
		var matter = blockInitProperties.matter;
		var cap = blockInitProperties.cap;

		this._altitude = altitude;
		this._ether = ether;
		this._plasma = plasma;
		this._matter = matter;
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

	generateResources(numberOfResources) {}

	generateExactResources(etherAdded, plasmaAdded, matterAdded) {
		var generateTotal = etherAdded + plasmaAdded + matterAdded;
		var existingTotal = this._ether + this._plasma + this._matter;
		if (generateTotal + existingTotal < this._cap) {
			this._ether += etherAdded;
			this._plasma += plasmaAdded;
			this._matter += matterAdded;
		} else if (existingTotal < this._cap) {
			var remainingCapacity = this._cap - existingTotal;
			var ratio = remainingCapacity / generateTotal;
			var scaledEther = etherAdded * ratio;
			var scaledPlasma = plasmaAdded * ratio;
			var scaledMatter = matterAdded * ratio;

			this._ether += Math.trunc(scaledEther);
			this._plasma += Math.trunc(scaledPlasma);
			this._matter += Math.trunc(scaledMatter);
		}

		this._save();
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
