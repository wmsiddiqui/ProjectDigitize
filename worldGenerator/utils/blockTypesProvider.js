var nconf = require('nconf');
var path = 'configs/blockTypes.json';
nconf.overrides({ always: 'be this value' });
nconf.argv().env().file({ file: path });
var results;

//Need to validate config file for the blocktypes here.
//Sum of Correlations for the single block type should not exceed 1 or -1

exports.getBlockTypes = function() {
	if (!results) {
		results = nconf.get('blockTypes');
	}
	return results;
};
