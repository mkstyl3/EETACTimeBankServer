const uri = require('../configs/db');
const mongoose = require('mongoose');
/** Object to interact with database connection */
const Database = {
    connect: () => mongoose.connect(uri),
};
/** Connection events */
// When successfully connected
mongoose.connection.on('connected', () => {
    console.log(`Mongoose default connection open to ${uri}`);
});
// If the connection throws an error
mongoose.connection.on('error', err => {
    console.log(`Mongoose default connection error: ${err}`);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
module.exports = Database