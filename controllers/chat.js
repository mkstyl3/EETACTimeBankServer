const Chat = require('../models/chat');

exports.getChat = function(req,res)
{
    const chat = [
        {
            userTo: 5,
            userFrom: 1,
            message: 'hi!',
            sentDate: new Date(),
        },
        {
            userTo: 1,
            userFrom: 5,
            message: 'hola, cómo estás?',
            sentDate: new Date(),
        }
    ];
    return res.status(200).send(chats)
};

exports.getUserChats = function(req,res)
{
    const chats = [
        {
            userId: 5,
            userName: 'Anna',
            userAvatar: 'https://www.vccircle.com/wp-content/uploads/2017/03/default-profile.png',
            socket: null,
            lastMessage: 'hi!',
            newMessages: 2,
        },
        {
            userId: 9,
            userName: 'Marc',
            socket: null,
            lastMessage: 'hola estás?'
        },
        {
            userId: 1,
            userName: 'Marta',
            socket: null,
            lastMessage: 'hey'
        },
        {
            userId: 5,
            userName: 'Alex',
            socket: null,
            lastMessage: 'vente este viernes de fiesta',
            newMessages: 5,
        }
    ];
    return res.status(200).send(chats);
};

exports.addChatToUsers = function(req,res)
{

};

exports.deleteChat = function(req,res)
{

};