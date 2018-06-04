const Chat = require('./models/chat');
const User = require('./models/user');
const boom = require('boom');

const usersHashMap = new Map(); // By user id
const socketsHashMap = new Map(); // By socket id

exports.chat = function (io) {
    io.on('connection', function (socket) {
        this.socket = socket;
        const user = null;

        socket.on('newUser', function (msg) {
            const id = JSON.parse(msg);
            User.findOne({ _id: id }, (err) => {
                if (err) console.log("no user");
                else {
                    if (usersHashMap.has(id)) {
                        let mysockets = usersHashMap.get(id);
                        mysockets.push(socket);
                        usersHashMap.set(id, mysockets);
                    }
                    else {
                        usersHashMap.set(id, [socket]);
                    }
                    socketsHashMap.set(socket, id);
                }
            });

        });

        /*DISCONNECT USER AND REMOVE HER SOCKET*/
        socket.on('disconnect', function () {
            console.log("user disconnected socket id:" + socket.id);
            const socketOwner = socketsHashMap.get(socket);
            const socketsList = usersHashMap.get(socketOwner);
            // Remove disconnected socket
            const activeSockets = socketsList && socketsList.filter(userSocket => userSocket.id !== socket.id);
            usersHashMap.set(socketOwner, activeSockets);
            socketsHashMap.delete(socket);
        });
        /* ASSOCIATE USER WITH THE SOCKET_ID*/
        socket.on('privateMessage', function (msg) {
            const frame = JSON.parse(msg);
            const { message, chatId } = frame;

            Chat.findOne({_id: chatId}, (err, OldChat) => {
                if (!OldChat) {
                    console.log("no existeix el xat");
                    return socket.emit('ErrorChat', chatId);
                }
                if (err) {
                    return socket.emit('Error', message);
                } else {
                    console.log("hem trobat el xat");
                    const { message: { id, ...message }, chatId } = frame;
                    console.log(message);
                    OldChat.messages.push(message);
                    OldChat.save(function (err) {
                        if (err) {
                            return socket.emit('Exception', boom.badImplementation("there is an error"))
                            console.log("hi ha un error");
                        }
                        else {
                            const userFromSockets = usersHashMap.get(message.userFrom);
                            if (userFromSockets && userFromSockets.length) {
                                userFromSockets.forEach(userSocket => {
                                    if (userSocket !== socket) {
                                        userSocket.emit('privateMessage', { chatId, message })
                                    }
                                })
                            }
                            const result = OldChat.users.find(user => user.userId !== message.userFrom);
                            if (result) {
                                const destId = result.userId;
                                const destUserSockets = usersHashMap.get(destId);
                                if (destUserSockets) {
                                    if (destUserSockets.length) {
                                        destUserSockets.forEach(function (userSocket) {
                                            userSocket.emit('privateMessage', {chatId, message})
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
            });
        });
    });
};

exports.socketInvalids = socketsHashMap;
exports.Sockets = usersHashMap;

