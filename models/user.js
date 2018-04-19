const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    mail: String,
    password: String,
    image: String,
    description: String,
    tags: [String],
    wallet: Number,
    rating: Number,
    numVal: Number,
    offered: [String],
    received: [String]
}, {collection:'users'});

module.exports = mongoose.model('User', userSchema);