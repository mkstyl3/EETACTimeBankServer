const HashMap = require('hashmap');
const Chat = require('./models/chat')
const User = require('./models/user')
const boom = require('boom');
let socket;
exports.socket = socket;

exports.chat = function (io) {
    let usersHashMap = new HashMap();
    console.log('Inits Socket Server');
    io.on('connection', function (socket) {
        console.log("user connected");
        var user = null;

        this.socket = socket;

        socket.on('init', function (msg) {
            user = msg.userFrom;
            usersHashMap.set(user, socket);
        });
        /*DISCONNECT USER AND REMOVE HER SOCKET*/
        socket.on('disconnect', function () {
            console.log("user disconnected");
            User.findOne({socketId: socket.id}, (err, user) => {
                if (err) console.log("not socket present");
                if (user) {
                    user.socketId.splice(user.socketId.indexOf(socket.id), 1);
                    console.log("user deleted");
                    user.save(function (err) { // => guardem missatge
                            if (err) {
                                console.log("no s'ha guardat");
                            }
                            else {
                                console.log("guardat a la base de dades")
                            }
                        }
                    );
                }
            })
        });
        /* RETURN USERS_ID OF CONNECTED USERS*/
        socket.on('ConnectedUsers', function () {
            User.find({socketId: {$exists: true, $ne: []}}, (err, result) => {
                if (err) console.log("some error")
                else {
                    if (result) {
                        console.log(result);
                    }
                    else {
                        console.log("not users connectes");
                    }
                }

            }).select('_id')

        })
        /* ASSOCIATE USER WITH THE SOCKET_ID*/
        socket.on('newUser', function (msg) {
            const id = JSON.parse(msg)
            User.findOne({_id: id}, (err, myuser) => {
                if (err) console.log("no user");
                else {
                    myuser.socketId.push(socket.id)
                    myuser.save(function (err) { // => guardem missatge
                            if (err) {
                                console.log("no s'ha guardat");
                            }
                            else {
                                console.log("guardat a la base de dades")
                            }
                        }
                    );
                }
                ;

            });

        })
        socket.on('privateMessage', function (msg) {
            const frame = JSON.parse(msg);
            const {message, ...messageee} = frame;
            const {chatId, ...mens} = frame;
            Chat.findOne({_id: chatId}, (err, OldChat) => {
                if (!OldChat) return socket.emit('exception', boom.badData("there's no a chat")); //=> eliminar-lo
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
                                User.findOne({_id: result[0].userId}, (err, userComplete) => {

                                    if (!userComplete) return socket.emit('exception', boom.badData("there's no an user in db"));
                                    if (err) return socket.emit('exception', boom.badImplementation("there is an error"))
                                    else {
                                        if (userComplete.socketId.length === 0) {
                                            console.log("l'usuari no està connectat");
                                        }
                                        else {
                                            userComplete.socketId.forEach(function (valor) {
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


                }

            });
        });

    });
}