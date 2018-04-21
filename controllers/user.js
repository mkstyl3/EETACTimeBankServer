const User = require('../../EETACTimeBankServer/models/user');

//Función para entrar en el sistema
//try-catch are implicit thanks to the express-promise-router lib
exports.signIn = async(req,res,next) => {
    User.findOne({username:req.body.request.username}, (err, user) => {
        if (!user) return res.send( {
            requestId: null,
            responseId: -1,
            request: req.body.request,
            response: "User doesn't exist",
            user: null
        });

        if (err) return res.send({
                requestId: null,
                responseId: -3,
                request: req.body.request,
                response: err.toString(),
                user: null
            }
        );

        if ((req.body.request.password === user.password) && (user.admin === false)) {
            return res.send({
                    requestId: null,
                    responseId: 1,
                    request: req.body.request,
                    response: 'Hello '+user.username,
                    user: user
                }
            );
        }

        if ((req.body.request.password === user.password) && (user.admin === true)) {
            return res.send({
                    requestId: null,
                    responseId: 2,
                    request: req.body.request,
                    response: 'Hello Admin '+user.username,
                    user: user
                }
            );
        }

        else return res.send({
                requestId: null,
                responseId: -2,
                request: req.body.request,
                response: 'Invalid password',
                user: null
            }
        );
    })
};

// Inserta un nuevo usuario (username único). No tocar xD
exports.insertUser = function(req, res) {
    let newUser = new User(req.body);
    newUser.save(function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
        console.log(err + user);
    });
};

// Devuelve una lista con todos los usuarios
exports.selectAllUsers = function (req, res) {
    User.find({}, { __v: false })
        .populate('listaOfertada').populate('listaRecibida')
        .exec( function (err, users) {
                if (err) {
                    console.log(err);
                    return res.status(202).send({'result': 'ERROR'});  // Devuelve un JSON
                } else {
                    return res.status(200).send(users);                // Devuelve un JSON
                }
            }
        );
};

// Devuelve el usuario buscado
exports.selectOneUser = function (req, res) {
    User.findOne({ username: req.params.name }, { __v: false })
        .populate('listaOfertada').populate('listaRecibida')
        .exec( function (err, user) {
                if(err){
                    console.log(err);
                    return res.status(202).send({'result': 'ERROR'});  // Devuelve un JSON
                }else{
                    return res.status(200).send(user);                 // Devuelve un JSON
                }
            }
        );
};



// Actualiza la información de un usuario
exports.updateUser = function (req, res) {
    User.update({ username: req.params.name }, req.body, function(err) {
        if (err) {
            console.log(err);
            return res.status(202).send({'result': 'ERROR'});       // Devuelve un JSON
        }else{
            return res.status(200).send({'result': 'ACTUALIZADO'}); // Devuelve un JSON
        }
    });
};

// Elimina de la Base de Datos el usuario buscado
exports.deleteUser = function (req, res) {
    User.remove({ username: req.params.name }, function(err) {
        if(err){
            console.log(err);
            return res.status(202).send({'result': 'ERROR'});     // Devuelve un JSON
        }else{
            return res.status(200).send({'result': 'ELIMINADO'}); // Devuelve un JSON
        }
    });
};
