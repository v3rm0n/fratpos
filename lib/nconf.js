//Configuration parameters from argument line, environment and file
var nconf = require('nconf');
//Overrides for Appfog
if(process.env.VCAP_SERVICES){
  console.log('Overriding values for AppFog');
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0]['credentials'];
  nconf.overrides({
    "server": {
      "port": process.env.VCAP_APP_PORT
    },
    "database": {
      "name": mongo.db,
      "host": mongo.hostname,
      "port": mongo.port,
      "username": mongo.username,
      "password": mongo.password
    }
  });
}
//Usual pipeline
nconf.argv().env().file({ file: './config.json' });
module.exports = nconf;