var nconf = require('nconf');
var path = 'configs/blockTypes.json';
nconf.overrides({ always: 'be this value' });
nconf.argv().env().file({ file: path });
var results = nconf.get('blockTypes');

module.exports = results;
