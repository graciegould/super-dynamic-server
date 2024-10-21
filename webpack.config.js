
const prodConfig = require('./config/prod.config.js');
const devConfig = require('./config/dev.config.js');
module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;;