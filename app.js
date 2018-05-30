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
const io = require('socket.io').listen(server);
const chat = require('./chat');
const MongoDB = require('./controllers/dataBase');
const fileUpload = require('express-fileupload');
var debug = require('debug')('eetactimebankserver:server');
const passport = require('passport'); 


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
app.use(fileUpload());

app.configure(function() {
    app.use(passport.initialize());
});

//Routes
app.use('/users', require('./routes/users'));
app.use('/activities', require('./routes/activities')(io));
app.use('/chats', require('./routes/chats'));
app.use('/activityRequest', require('./routes/activityRequest')(io));
app.use('/publications', require('./routes/publication'));
app.use('/files', require('./routes/file'));

// Mongoose
MongoDB.connect();
chat.chat(io);

process.on('SIGINT', function () {
    process.exit();
});

server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
