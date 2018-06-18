const boom = require('boom');
const Chat = require('../models/chat');
const User = require('../models/user');
const ChatController = require('../chat');
const mongoose = require('mongoose');
/*RETURN A PARTICULAR CHAT BY THE ID ARREGLAR*/
exports.getChatUsers = function (req, res) {
    if (req.params.id) {

        console.log("********* req", req.params.id);
        Chat.findById(req.params.id, (err, chats ) => {
            console.log("****************** users: ", chats.users);
            if (err) return res.send(boom.badRequest());
            console.log("**** fin de getChatUsers!!!!!!");
            res.status(200).send(chats.users);
        });
    }
    else {
        return res.send(boom.badData("there's no an id"));
    }
};

exports.getChatMessages = function (req, res) {
    if (req.params.id) {
        let { offset, limit } = req.query;
        offset = parseInt(offset);
        limit = parseInt(limit);
        Chat.aggregate([{$match: {_id: mongoose.Types.ObjectId(req.params.id)}}, {$project: {count: {$size: "$messages"}}}], function (err, docs) {
            if (err) {
                console.log(err);
                return res.send(boom.badRequest());
            }
            else {
                const sizeOfMessages = (docs[0].count);
                const lasMessagesChunk = limit > (sizeOfMessages - offset);
                const inicial = lasMessagesChunk ? 0 : -(offset + limit);
                const final = Math.max(lasMessagesChunk ? (sizeOfMessages - offset) : limit, 0);

                console.log(inicial, final);
                if(final) {
                    Chat.findById(req.params.id, {messages: {$slice: [inicial, final]}, 'users': 0}, (err, messages) => {
                        if (err) {
                            console.log(err);
                            return res.send(boom.badRequest())
                        }
                        console.log("los mensajes" + messages);
                        res.status(200).send(messages);
                    });
                } else {
                    console.log("No hay más mensajes!");
                    res.status(200).send({ messages: [] });
                }
            }
        });
    }
    else {
        console.log(error);
        return res.send(boom.badData("there's no an id"));
    }
};
/*
* exports.getChatMessages = function (req, res) {
    if (req.params.id) {
        Chat.findById(req.params.id, 'messages', (err, { messages }) => {
            if (err) return res.send(boom.badRequest());
            const { limit, offset } = req.query;
            const allMessages = messages.reverse().slice(offset, offset + limit).map(message => {
                if (message.userFrom !== req.params.idUser && message.readIt === false) {
                    return { ...message, readIt: true };
                } else {
                    return message;
                }
            });

            res.status(200).send(allMessages.reverse());
        });
    }
    else {
        return res.send(boom.badData("there's no an id"));
    }
};*/



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
};

exports.getUserChats = function (req, res) {
    const chatsTosend = [];
    Chat.find({'users.userId':req.params.id}, (err, chats) => {
        if (err) return res.send(boom.badRequest());
        if(chats){
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
        return res.status(200).send(chatsTosend);

    }
    console.log("no hi han xats");})

};


exports.addChatToUsers = function (req, res) {
    const { user1, user2 } = req.body;
    Chat.searchByUsers({ user1, user2 }, (err, chat) => { //=>user1 must to be he owner
        if(chat) {
            return res.send({status:'ok', chatId: chat._id});
        }

        User.findOne({'username':req.body.user1}, ( err,user)=>{
            console.log("creeem el xat");
            if (err) return res.send(boom.badRequest());
            const user1T = user;
            User.findOne({'username':req.body.user2}, ( err,user)=> {
                if (err) return res.send(boom.badRequest());
                if(user2){
                    console.log("hem trobat l'usuari");
                const user2T = user;
                const newChat = {};
                const user1= {};
                const user2= {};
                user1["userId"] = user1T.id;
                user1["userName"] = user1T.username;
                user1["userAvatar"] = user1T.image;
                user2["userId"] = user2T.id;
                user2["userName"] = user2T.username;
                user2["userAvatar"] = user2T.image;
                newChat["users"] = [user1,user2];
                newChat["messages"] = [];

                const chat = new Chat(newChat);
                console.log("el chat"+chat);
                Chat.create(chat, (err, chat) => {
                    /*THIS POINT SEND THE NEW CHAT TO USERS VIA SOCKET??*/
                    if(chat){
                    const chatToSend = {'id':chat._id,'userId':user2T.id,'userName':user2T.username,'userAvatar':user2T.image,'lastMessage':'','newMessages':0};
                    const sockets = ChatController.Sockets;
                    if(sockets){
                        if(sockets.has(user2T.id)){
                            const privateSockets = sockets.get(user2T.id);
                            privateSockets.forEach(function(valor){
                                console.log("l'usuari està connectat i li enviem el xat");
                                valor.emit("newChat",chatToSend);
                            });

                        }
                    }
                    return res.send({status:'ok', chatId: chat._id});
                    }
                });}
            });
        });
    });
};

exports.deleteChat = function (req, res) {

};