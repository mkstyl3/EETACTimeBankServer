'use strict';
let mongoose = require('mongoose');

// Declaración del esquema
let ActivityRequestSchema = new mongoose.Schema(
    {
        userFrom:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userTo:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        activity:       { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
        isDone:         { type: Boolean},
        accepted:       { type: Boolean},
        date:           { type: Date, default: Date.now }
    }
);


module.exports.schema = ActivityRequestSchema;
module.exports = mongoose.model('ActivityRequest', ActivityRequestSchema);