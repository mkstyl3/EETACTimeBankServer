let mongoose = require('mongoose');

// Declaración del esquema
let ActivitySchema = new mongoose.Schema(
    {
        name:           { type: String, required: true },
        latitude:       { type: Number},
        longitude:      { type: Number},
        //location:       { type: { type: String }, coordinates: [ Number], default : { type: "Point",  coordinates: [41.275704, 1.986424] }},
        //location:       { type: { type: String }, coordinates: [ Number]},
        location: { type: {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [41.275704, 1.986424]} },
        cost:           { type: Number},
        user:           { type: String },
        description:    { type: String},
        tags    :       { type: [ String ] },
        category:       { type: [ String]},
        imatge:         { type: String},
        date:           { type: Date, default: Date.now }
    }
);
//ActivitySchema.dropIndexes();
ActivitySchema.index({'location': '2dsphere'});
ActivitySchema.index({'$**': 'text'});

//ActivitySchema.index({name: 'text',description:'text',user:'text',tags:'text',category:'text'});
// Exporta el modelo y el esquema a la Base de Datos
module.exports.schema = ActivitySchema;
module.exports = mongoose.model('Activity', ActivitySchema);
