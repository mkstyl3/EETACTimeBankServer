const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        users:      [{userId: String, userName:String}],
        messages:  [{userTo: String,text:String,date:Date,readIt:Boolean}]

    }
);
module.exports = mongoose.model('Chat', chatSchema);