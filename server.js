//DEPENDENCY (.ENV)
var dotenv = require('dotenv');
dotenv.config();

//OTHER DEPENDENCIES
var express = require('express');
var logger = require('morgan');
var exphbs = require('express-handlebars');
//DATABASE INFO
var mongoose = require('mongoose');

var MONGODB_URI = process.env.MONGODB_URI;

var MONGODB_URI = MONGODB_URI || 'mongodb://localhost/newstaker';
mongoose.Promise = global.Promise;
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);

//PORT
var PORT = process.env.PORT || 3001;

//INITIALIZE EXPRESS
var app = express();

//STATIC FOLDER
app.use(express.static('public'));

//MIDLEWARE
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- HANDLEBARS ----//
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// --- Declaring Routes -----//
var routes = require('./controllers/newstaker');
app.use(routes);

//START SERVER
app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});
