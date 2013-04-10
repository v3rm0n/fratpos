//Configuration parameters from argument line, environment and file
var nconf = require('nconf');
nconf.argv().env().file({ file: './config.json' });
module.exports = nconf;