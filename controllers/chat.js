const boom = require('boom');
const Chat = require('../models/chat');
const User = require('../models/user')
/*RETURN A PARTICULAR CHAT BY THE ID*/
exports.getChat = function (req, res) {
    if (req.params.id) {
        Chat.findById(req.params.id, (err, chat) => {
            if (err) return res.send(boom.badRequest());
            //update messages
            var i =0;
            do{
                if (chat.messages[i]!=undefined&&chat.messages[i].userFrom !== req.params.idUser && chat.messages[i].readIt === false) { //=>query with userId req.params.idUser
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
        if (err) return res.send(boom.badRequest());
        const size = chats.length;

        var i = 0;
        var lastMessage;
        var userId;
        var id;

        while (i < chats.length) {
            var j = 0;
            var newMessages = 0;
            const messages = chats[i].messages;
            const lastMessage = messages[messages.length - 1];

            userFound = chats[i].users.filter(user => user.userId !== req.params.id);
            id = chats[i]._id;//=> id del chat
            while (j < chats[i].messages.length){
                if (chats[i].messages[j].userFrom !== req.params.id && chats[i].messages[j].readIt === false) { //=>request id
                    newMessages += 1
                }
                j += 1;
            }
            i += 1;
            if(lastMessage!=undefined)
                chatsTosend.push({'id':id, 'userId': userFound[0].userId,'userName':userFound[0].userName,'userAvatar':userFound[0].userAvatar, 'lastMessage':lastMessage.text, 'newMessages': newMessages});
            else
            chatsTosend.push({'id':id, 'userId': userFound[0].userId,'userName':userFound[0].userName,'userAvatar':userFound[0].userAvatar, 'lastMessage':'', 'newMessages': newMessages});
        }
        console.log(chatsTosend);
        return res.status(200).send(chatsTosend);

    })


};

exports.addChatToUsers = function (req, res) {
    console.log('chats/addChat');
    User.findOne({'username':req.body.user1}, ( err,user)=>{
        if (err) return res.send(boom.badRequest());
        var user1T = user;
        //console.log(req.body.user1);
        //console.log(user);
        User.findOne({'username':req.body.user2}, ( err,user)=>{
            if (err) return res.send(boom.badRequest());
            var user2T = user;
            //console.log(req.body.user2);
            //console.log(user);

            var newChat = {};
            var user1= {};
            var user2= {};
            user1["userId"] = user1T.id;
            user1["userName"] = user1T.username;
            user1["userAvatar"] = "";
            user2["userId"] = user2T.id;
            user2["userName"] = user2T.username;
            user2["userAvatar"] = "";
            newChat["users"] = [user1,user2];
            newChat["messages"] = [];
            var chat = new Chat(newChat);
            chat.save();
            return res.send({status:'ok'});

        });
    });
};

exports.deleteChat = function (req, res) {

};