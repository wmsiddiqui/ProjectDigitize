var nconf = require('nconf');
var path = 'configs/blockTypes.json';
nconf.overrides({ always: 'be this value' });
nconf.argv().env().file({ file: path });
var results;

exports.getBlockTypes = function() {
	if (!results) {
		results = nconf.get('blockTypes');
	}
	return results;
};
