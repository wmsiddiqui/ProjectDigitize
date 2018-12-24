var resourceRandomizer = require('../utils/resourceRandomizer');
var numberChecker = require('../utils/numberChecker');
var biasValidator = require('../utils/biasValidator');

module.exports = class Block {
	constructor(id, blockInitProperties, saveClient) {
		if (!blockInitProperties.blockType) {
			throw new Error('No blockType found in blockInitProperties');
		}

		this._validateBlockInitProperties(blockInitProperties);

		this._saveClient = saveClient;

		this.getId = function() {
			return id;
		};

		this.blockTypeId = blockInitProperties.blockType.id;
		this._cap = blockInitProperties.blockType.cap;
		this._bias = blockInitProperties.blockType.bias;

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
		if (
			blockInitProperties.resourceInitCount &&
			!numberChecker.isPositiveWholeNumber(blockInitProperties.resourceInitCount)
		) {
			throw new Error('resourceInitCount must be a positive whole number.');
		}

		if (blockInitProperties.blockType.bias) {
			biasValidator.validateBias(blockInitProperties.blockType.bias);
		}

		if (!numberChecker.isPositiveWholeNumber(blockInitProperties.blockType.cap)) {
			throw new Error('Cap is not configured correctly on blockInitProperties');
		}
	}

	_save() {
		var saveResult = this._saveClient.saveBlock(this);
		if (!saveResult) {
			console.log('Warning: Data not persisted to database!');
		}
	}

	toJson() {
		return {
			id: this.getId(),
			cap: this._cap,
			blockTypeId: this.blockTypeId,
			resources: {
				ether: this._ether,
				plasma: this._plasma,
				matter: this._matter
			}
		};
	}
};
