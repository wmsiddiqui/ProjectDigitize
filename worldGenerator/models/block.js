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

		this._blockSaver = blockSaver;
		this._save();
	}

	generateResources(ether, plasma, matter) {
		let generateTotal = ether + plasma + matter;
		let existingTotal = this._ether + this._plasma + this._matter;
		if (generateTotal + existingTotal < this._cap) {
			this._ether += ether;
			this._plasma += plasma;
			this._matter += matter;
		} else if (existingTotal < this._cap) {
			//TODO: somehow distribute amounts?
		}

		this._save();
	}

	consumeResources(ether, plasma, matter) {
		if (ether <= this._ether && plasma <= this._plasma && matter <= this._matter) {
			this._ether -= ether;
			this._plasma -= plasma;
			this._matter -= matter;
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
