let mongoose = require('mongoose');

// Declaración del esquema
let ActivitySchema = new mongoose.Schema(
    {
        name:          { type: String,   required: true },  // Campo obligatório para insertar
        latitude:      { type: Number,   required: true },  // Campo obligatório para insertar
        longitude:     { type: Number,   required: true },  // Campo obligatório para insertar
        cost:          { type: Number,   required: true },  // Campo obligatório para insertar
        user:          { type: String,   required: true },  // Campo obligatório para insertar
        description:   { type: String },
        image:         { type: String},
        tags:          { type: [String] },
        date:          { type: Date,     default: Date.now },
        isDone:        { type: Boolean,  default: false }
    }
);

// Exporta el modelo y el esquema a la Base de Datos
module.exports.schema = ActivitySchema;
module.exports = mongoose.model('Activity', ActivitySchema);
