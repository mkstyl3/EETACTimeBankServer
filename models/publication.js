let mongoose = require('mongoose');

// Declaración del esquema
let PublicationSchema = new mongoose.Schema(
    {
        author:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text:           { type: String, required: true },  // Campo obligatório para insertar
        date:            { type: String}
    }
);

// Exporta el modelo y el esquema a la Base de Datos
module.exports.schema = PublicationSchema;
module.exports = mongoose.model('Publication', PublicationSchema);
