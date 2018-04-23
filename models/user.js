const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:      { type: String, required: true, unique: true },  // Campo obligatório para insertar
    password:      { type: String, required: true },                // Campo obligatório para insertar
    name:          { type: String, required: true },                // Campo obligatório para insertar
    mail:          { type: String, required: true },                // Campo obligatório para insertar
    description:   { type: String },
    tags:          { type: [ String ] },
    image:         { type: String, default: 'https://www.vccircle.com/wp-content/uploads/2017/03/default-profile.png' },
    wallet:        { type: Number, default: 10 },
    rating:        { type: Number, default: 0 },
    numVal:        { type: Number, default: 0 },
    offered:       [ { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' } ],
    received:      [ { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' } ],
    admin: Boolean
});

module.exports = mongoose.model('User', userSchema);
