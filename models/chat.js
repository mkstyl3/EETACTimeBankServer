const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        users:      [{user:String,last:Number}],
        messages:  [{user: String,text:String,date:Date}]
    }
);

module.exports = mongoose.model('Chat', chatSchema);