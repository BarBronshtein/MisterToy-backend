let config;

// keys.ks - figure out what set of credentials to return
if (true || process.env.NODE_ENV === 'production') config = require('./prod');
else config = require('./dev');

module.exports = config;
