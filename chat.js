const HashMap = require('hashmap');


exports.chat = function (io)
{
    let usersHashMap = new HashMap();
    console.log('inits socket server');
    io.on('connection',function(socket){
        var user = null;

        socket.on('disconnect',function() {
            usersHashMap.remove(user);
        });

        socket.on('init',function(msg){
            user = msg.userFrom;
            usersHashMap.set(user,socket);
        });

        socket.on('message',function(msg){
            var userTo = msg.userTo;
            var message = msg.message;
            var date = Date.now();
            var socketReceptor = usersHashMap.get(userTo);
            if(socketReceptor!=null)
            {
                var response;
                response.userTo = userTo;
                response.message = message;
                response.date = date;
                socketReceptor.emit('message',response);
            }
        })

    });
}