const HashMap = require('hashmap');


exports.chat = function (io) {
    let usersHashMap = new HashMap();
    console.log('Inits Socket Server');
    io.on('connection', function (socket) {
        var user = null;

        socket.on('disconnect', function () {
            usersHashMap.remove(user);
        });

        socket.on('init', function (msg) {
            user = msg.userFrom;
            usersHashMap.set(user, socket);
        });

        socket.on('message', function (msg) { //-> idconversa , missatge(userTo,missatge)


            var userTo = msg.userTo;
            var message = msg.message;
            var idChat = msg.idChat;
            var date = Date.now();

            Chat.findOne({id_: idChat}, (err, Chat) => {
                if (!Chat) return res.send({
                    response: "maybe Create a new Chat",
                });
                if (err) return res.send({
                        response: err.toString(),
                    }
                );
                else {
                    Chat.messages.add(userTo, message, date, false);
                    Chat.save(function (err) {
                        if (err) {
                            console.log(err);
                            return res.status(202).send({'result': 'ERROR'});
                        } else {
                            return res.status(201).send({'result': 'INSERTADO'});

                        }
                    });
                    var socketReceptor = usersHashMap.get(userTo);
                    if (socketReceptor != null) {
                        var response;
                        response.userTo = userTo;
                        response.message = message;
                        response.date = date;
                        response.readIt = false;
                        socketReceptor.emit('message', response);
                    }
                }

            });
        });
    });
}