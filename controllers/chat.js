const boom = require('boom');
const Chat = require('../models/chat');
/*RETURN A PARTICULAR CHAT BY THE ID*/
exports.getChat = function(req,res) {
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
/*SAVING A TEST CHAT*/
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
    Chat.find({'users.userId':req},(err,erro) => console.log(erro))

    // res => the id from the users
    /*
    const chats = [
        {
            id: '5aeb4d9ffbe63f38202f2a0b',
            userId: 5,
            userName: 'Anna',
            userAvatar: 'https://www.vccircle.com/wp-content/uploads/2017/03/default-profile.png',
            socket: null,
            lastMessage: 'hi!',
            newMessages: 2,
        },
        {
            id: '5aeb4d9ffbe63f38202f2a0b',
            userId: 9,
            userName: 'Marc',
            socket: null,
            lastMessage: 'hola estás?'
        },
        {
            id: '5aeb4d9ffbe63f38202f2a0b',
            userId: 1,
            userName: 'Marta',
            socket: null,
            lastMessage: 'hey'
        },
        {
            id: '5aeb4d9ffbe63f38202f2a0b',
            userId: 5,
            userName: 'Alex',
            socket: null,
            lastMessage: 'vente este viernes de fiesta',
            newMessages: 5,
        }
    ];
    return res.status(200).send(chats);
    */
};

exports.addChatToUsers = function(req,res)
{

};

exports.deleteChat = function(req,res)
{

};