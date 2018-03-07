module.exports = class Block {
	constructor(name, altitude, ether, plasma, matter, cap) {
		this._altitude = altitude;
		this._ether = ether;
		this._plasma = plasma;
		this._matter = matter;
		this._cap = cap;
		this.getName = function() {
			return name;
		};
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

		_save();
	}

	consumeResources(ether, plasma, matter) {
		if (ether <= this._ether && plasma <= this._plasma && matter <= this._matter) {
			this._ether -= ether;
			this._plasma -= plasma;
			this._matter -= matter;
			_save();
			return true;
		}
		return false;
	}

	print() {
		console.log('Altitude: \t' + this.altitude);
		console.log('Ether: \t\t' + this.ether);
		console.log('Plasma: \t' + this.plasma);
		console.log('Matter: \t' + this.matter);
	}

	_save() {
		//TODO: Persist
	}
};
