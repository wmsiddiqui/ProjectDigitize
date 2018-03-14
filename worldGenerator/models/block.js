var resourceRandomizer = require('../utils/resourceRandomizer');
var numberChecker = require('../utils/numberChecker');

module.exports = class Block {
	constructor(id, blockInitProperties, blockSaver) {
		this._validateBlockInitProperties(blockInitProperties);

		this._altitude = blockInitProperties.altitude;
		this._blockSaver = blockSaver;
		this._cap = blockInitProperties.cap;

		this.getId = function() {
			return id;
		};

		this._bias = blockInitProperties._bias;

		this._save();

		if (blockInitProperties.resourceInitCount) {
			this.generateResources(blockInitProperties.resourceInitCount);
		}
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
		var totalNumberOfResources = this._ether + this._plasma + this._matter;
		var totalNumberOfResourcesToGenerate = numberOfResources;

		if (totalNumberOfResources >= this._cap) {
			return;
		} else if (totalNumberOfResources + numberOfResources > this._cap) {
			numberOfResources = this._cap - totalNumberOfResources;
		}

		var resourcesToGenerate = resourceRandomizer.getResources(numberOfResources, this._bias);
		_this.ether += resourcesToGenerate.etherGenerated;
		_this.plasma += resourcesToGenerate.plasmaGenerated;
		_this.matter += resourcesToGenerate.matterGenerated;

		this_.save();
		return resourcesToGenerate;
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

	_validateBlockInitProperties(blockInitProperties) {
		if (!numberChecker.isPositiveNumber(blockInitProperties.altitude)) {
			throw new Error('Altitude must be a positive number.');
		}

		if (!numberChecker.isPositiveWholeNumber(blockInitProperties.cap)) {
			throw new Error('Cap must be a positive whole number');
		}

		if (
			blockInitProperties.resourceInitCount &&
			!numberChecker.isPositiveWholeNumber(blockInitProperties.resourceInitCount)
		) {
			throw new Error('resourceInitCount must be a positive whole number.');
		}

		if (
			blockInitProperties.bias &&
			(!numberChecker.isPositiveNumber(blockInitProperties.bias.etherBias) ||
				!numberChecker.isPositiveNumber(blockInitProperties.bias.plasmaBias) ||
				!numberChecker.isPositiveNumber(blockInitProperties.bias.matterBias))
		) {
			throw new Error('All bias must be greater than zero');
		}

		if (
			blockInitProperties.bias &&
			blockInitProperties.bias.etherBias +
				blockInitProperties.bias.plasmaBias +
				blockInitProperties.bias.matterBias !=
				1
		) {
			throw new Error('Bias not configured correctly');
		}
	}

	_save() {
		var saveResult = this._blockSaver.saveBlock(this);
		if (!saveResult) {
			console.log('Warning: Data not persisted to database!');
		}
	}
};
