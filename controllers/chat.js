const boom = require('boom');
const Chat = require('../models/chat');
/*RETURN A PARTICULAR CHAT BY THE ID*/
exports.getChat = function (req, res) {
    if (req.params.id) {
        Chat.findById(req.params.id, (err, chat) => {
            if (err) return res.send(boom.badRequest());
            //update messages
            var i =0;
            do{
                if (chat.messages[i].userFrom !== req.params.idUser && chat.messages[i].readIt === false) { //=>query with userId req.params.idUser
                    chat.messages[i].readIt = true;
                }
             i+=1;
            }
            while(i<chat.messages.length);
            chat.save();
            console.log('this is the chat' +chat);
            res.status(200).send(chat);
        });
    }
    else {
        return res.send(boom.badData("there's no an id"));
    }
};
/*SAVING A TEST CHAT*/
exports.saveTestChat = function (req, res) {
    Chat.create(req.body, function (err, chat) {
        if (err) {
            console.log(err);
            return res.status(202).send({'result': 'ERROR'});     // Devuelve un JSON
        } else {
            return res.status(200).send(chat); // Devuelve un JSON
        }
    });
}

exports.getUserChats = function (req, res) {
    const chatsTosend = [];
    Chat.find({'users.userId':req.params.id}, (err, chats) => {
        const size = chats.length;

        var i = 0;
        var lastMessage;
        var userId;
        var id;

        do {
            var j = 0;
            var newMessages = 0;
            const messages = chats[i].messages;
            const lastMessage = messages[messages.length - 1];

            userFound = chats[i].users.filter(user => user.userId !== req.params.id);
            id = chats[i]._id;//=> id del chat
            do {
                if (chats[i].messages[j].userFrom !== req.params.id && chats[i].messages[j].readIt === false) { //=>request id
                    newMessages += 1
                }
                j += 1;
            }
            while (j < chats[i].messages.length);
            i += 1;
            chatsTosend.push({'id':id, 'userId': userFound[0].userId,'userName':userFound[0].userName,'userAvatar':userFound[0].userAvatar, 'lastMessage':lastMessage.text, 'newMessages': newMessages});
        }
        while (i < chats.length);
        console.log(chatsTosend);
        return res.status(200).send(chatsTosend);

    })


};

exports.addChatToUsers = function (req, res) {

};

exports.deleteChat = function (req, res) {

};