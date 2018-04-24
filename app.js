const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const chat = require('./chat');
const MongoDB =require('./controllers/dataBase')




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
app.use('/users',           require('./routes/users'));
app.use('/activities',      require('./routes/activities'));
app.use('/chats',           require('./routes/chats'));
app.use('/activityRequest', require('./routes/activityRequest'));

// Mongoose
MongoDB.connect();

//chat connections
chat.chat(io);

module.exports = app;
