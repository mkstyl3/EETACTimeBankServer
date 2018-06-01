'use strict';
let mongoose = require('mongoose');

// Declaración del esquema
let ActivitySchema = new mongoose.Schema(
    {
        name:           { type: String, required: true },
        latitude:       { type: Number},
        longitude:      { type: Number},
        cost:           { type: Number},
        user:           { type: String },
        description:    { type: String},
        tags    :       { type: [ String ] },
        category:       { type: [ String]},
        imatge:         { type: String},
        date:           { type: Date, default: Date.now },
        ratings:        [
          {
            userId:         {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
            comment:        {type:String, required: true},
            rate:           {type:Number, required: true},
            date:           { type: Date, default: Date.now }
          }
        ]
    }
);


// Exporta el modelo y el esquema a la Base de Datos
module.exports.schema = ActivitySchema;
module.exports = mongoose.model('Activity', ActivitySchema);

