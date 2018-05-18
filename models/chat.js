const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        users:     [ { userId: String, userName: String ,userAvatar: String} ],
        messages:  [ { userFrom: String, text: String, date: Date, readIt: Boolean } ]
    }
);

chatSchema.statics.searchByUsers = function(users, cb) {
    return this.findOne({ $and: [
        {'users': {'$elemMatch': {'userName': users.user1} } },
        {'users': {'$elemMatch': {'userName': users.user2} } },
    ]}).exec(cb);
};
module.exports = mongoose.model('Chat', chatSchema);