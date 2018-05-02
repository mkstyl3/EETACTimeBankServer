const Chat = require('../models/chat');
const boom = require('boom');
exports.getChat = function(req,res)
{
    if(req.params.id)
    {
        Chat.findById(req.params.id, (err, chat)=> {
            if (err) return res.send(boom.badRequest());
                res.status(200).send(chat);
    });
    }
    else
    {
        return res.send(boom.badData("there's no an id"));
    }
    };
    /*const chat = [
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
    return res.status(200).send(chats)*/

exports.saveTestChat = function(req,res){
      Chat.create(req.body, function(err,chat){
        if(err){
            console.log(err);
            return res.status(202).send({'result': 'ERROR'});     // Devuelve un JSON
        }else{
            return res.status(200).send(chat); // Devuelve un JSON
        }
    });
}
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