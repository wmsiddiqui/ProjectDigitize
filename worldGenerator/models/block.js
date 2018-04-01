var resourceRandomizer = require('../utils/resourceRandomizer');
var numberChecker = require('../utils/numberChecker');
var biasValidator = require('../utils/biasValidator');

module.exports = class Block {
	constructor(id, blockInitProperties, blockSaver) {
		this._validateBlockInitProperties(blockInitProperties);

		this._altitude = blockInitProperties.altitude;
		this._blockSaver = blockSaver;
		this._cap = blockInitProperties.cap;

		this.getId = function() {
			return id;
		};

		if (blockInitProperties.blockType) {
			this._bias = blockInitProperties.blockType.bias;
			this.blockTypeId = blockInitProperties.blockType.id;
		}
		this._ether = 0;
		this._plasma = 0;
		this._matter = 0;

		this._save();

		if (blockInitProperties.resourceInitCount) {
			this.generateResources(blockInitProperties.resourceInitCount);
		}
	}

	setBias(etherBias, plasmaBias, matterBias) {
		var total = etherBias + plasmaBias + matterBias;
		if (etherBias + plasmaBias + matterBias == 1) {
			this._bias = {
				etherBias: etherBias,
				plasmaBias: plasmaBias,
				matterBias: matterBias
			};
		}
	}

	generateResources(numberOfResources) {
		var totalNumberOfResources = this._ether + this._plasma + this._matter;
		var totalNumberOfResourcesToGenerate = numberOfResources;

		if (totalNumberOfResources + totalNumberOfResourcesToGenerate >= this._cap) {
			totalNumberOfResourcesToGenerate = this._cap - totalNumberOfResources;
		}

		var resourcesToGenerate = resourceRandomizer.getResources(totalNumberOfResourcesToGenerate, this._bias);
		this._ether += resourcesToGenerate.etherGenerated;
		this._plasma += resourcesToGenerate.plasmaGenerated;
		this._matter += resourcesToGenerate.matterGenerated;

		this._save();
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

		if (blockInitProperties.blockType && blockInitProperties.blockType.bias) {
			biasValidator.validateBias(blockInitProperties.blockType.bias);
		}
	}

	_save() {
		var saveResult = this._blockSaver.saveBlock(this);
		if (!saveResult) {
			console.log('Warning: Data not persisted to database!');
		}
	}
};
