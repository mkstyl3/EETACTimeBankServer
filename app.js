const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//////////////////////// Middlewares ///////////////////////////////

// View engine setup (delete)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configurations
app.use(cors());
// ExpressJS will parse the request before it got routed
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

//Routes
app.use('/users', require('./routes/users'));
app.use('/activities', require('./routes/activities'));

// Mongoose
mongoose.connect('mongodb://localhost/EetacTimeBank');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to Database');
});

module.exports = app;
