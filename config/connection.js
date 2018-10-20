//DATABASE INFO
var mongoose = require('mongoose');

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/newstaker';
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

module.exports = MONGODB_URI;
