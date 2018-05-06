const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        users:     [ { userId: String, userName: String ,userAvatar: String} ],
        messages:  [ { userFrom: String, text: String, date: Date, readIt: Boolean } ]
    }
);
module.exports = mongoose.model('Chat', chatSchema);