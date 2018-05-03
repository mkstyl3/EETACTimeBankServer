const HashMap = require('hashmap');
const Chat = require('./models/chat')
const User = require('./models/user')
const boom = require('boom');

exports.chat = function (io) {
    let usersHashMap = new HashMap();
    console.log('Inits Socket Server');
    io.on('connection', function (socket) {
        console.log("user connected");
        var user = null;

        socket.on('disconnect', function () {
            usersHashMap.remove(user);
            console.log("user disconnected");
        });

        socket.on('init', function (msg) {
            user = msg.userFrom;
            usersHashMap.set(user, socket);
        });

        socket.on('privateMessage', function (msg) {
            const frame = JSON.parse(msg);
            const {message, ...messageee} = frame;
            const {chatId, ...mens} = frame;
            Chat.findOne({_id: chatId}, (err, OldChat) => {
                if (!OldChat) return socket.emit('exception', boom.badData("there's no an id"));
                if (err) return socket.emit('exception', boom.badImplementation("there is an error"))
                    ;
                else {
                    OldChat.messages.push(message);
                    OldChat.save(function (err) { // => guardem missatge
                        if (err) {

                            return socket.emit('exception', boom.badImplementation("there is an error"))
                        }
                        else {
                            const result = OldChat.users.filter(user => user.userId !== message.userFrom);
                            if (result) {
                                User.findOne({_id:result[0].userId}, (err, userComplete) => {

                                    if (!userComplete) return socket.emit('exception', boom.badData("there's no an user in db"));
                                    if (err) return socket.emit('exception', boom.badImplementation("there is an error"))
                                    else {
                                        if(userComplete.socketId.length === 0){
                                            console.log("l'usuari no està connectat");
                                        }
                                        else {
                                            userComplete.socketId.forEach( function(valor) {
                                                socket.broadcast.to(valor).emit('privateMessage', message);
                                            });
                                        }

                                    }
                                })

                            }
                            else {
                                socket.emit('exception', boom.notFound("the other user doesn't exists"))
                            }

                        }
                    });

                    /*var socketReceptor = usersHashMap.get(userTo);
                    if (socketReceptor != null) {
                        var response;
                        response.userTo = userTo;
                        response.message = message;
                        response.date = date;
                        response.readIt = false;
                        socketReceptor.emit('message', response);
                    }*/
                }

            });
        });
    });
}