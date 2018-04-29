let mongoose = require('mongoose');

// Declaración del esquema
let ActivitySchema = new mongoose.Schema(
    {
        name:           { type: String, required: true },  // Campo obligatório para insertar
        latitude:       { type: Number},  // Campo obligatório para insertar
        longitude:      { type: Number},  // Campo obligatório para insertar
        cost:           { type: Number},  // Campo obligatório para insertar
        user:           { type: String},  // Campo obligatório para insertar
        description:    { type: String},
        imatge:         { type: String},
        date:           { type: Date, default: Date.now }
    }
);

// Exporta el modelo y el esquema a la Base de Datos
module.exports.schema = ActivitySchema;
module.exports = mongoose.model('Activity', ActivitySchema);
