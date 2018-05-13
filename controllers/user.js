const User = require('../../EETACTimeBankServer/models/user');
const JWT = require('jsonwebtoken'); 
const { JWT_SECRET } = require('../configs/keys');
let nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

//try-catch blocks are implicit thanks to the express-promise-router lib from routes.users.js//
signToken = user => {
    return JWT.sign({
        iss: 'eetac.upc.ea',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() +1) // Current time +1 day ahead
    }, JWT_SECRET);
};

module.exports = {
    //Función para entrar en el sistema
    signIn: async (req,res,next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({
            'username': req.user.username,
            'token': token,
            'userId': req.user.id
        });
    },

    // Inserta un nuevo usuario (username único).
    signUp: async (req, res) => {
        console.log("I'm inside of insertUserToken!");

        //Check if there is a user with the same username
        const foundUser = await User.findOne({ username: req.value.body.username });
        if(foundUser) {
            return res.status(403).json({ dbError : 'Duplicated'})
        }

        //console.log(req.value.body);
        const newUser = new User(req.value.body);
        let user = await newUser.save();
        //console.log('final hash es: '+user.password);
        let userId = user.id;
        // Generate the token
        const token = signToken(newUser);
        //respond with a token

        //enviamos un mail al nuevousuario
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'eetac.ea@gmail.com',
                pass: 'eetac123'
            }
        });
        // Definimos el email
        let mailOptions = {
            from: 'eetac.ea@gmail.com',
            to: req.body.mail,
            subject: 'Bienvenido al banco de tiempo!',
            text: 'Bienvenido a nuestra app señor ' + req.body.name
        };
        // Enviamos el email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.send(500, err.message);
            }
        });
        res.status(200).json({ token, userId });
        //res.json(user);

    },

    secret: async (req, res, next) => {
        console.log('I managed to get here!');
        res.json({ secret: 'resource'});
    },

    // Devuelve una lista con todos los usuarios
    selectAllUsers: async (req, res) => {
        User.find({}, { __v: false })
            .populate('offered', { __v: false }).populate('received', { __v: false })
            .exec( function (err, users) {
                if (err) {
                    console.log(err);
                    return res.status(202).send({'result': 'ERROR'});  // Devuelve un JSON
                } else {
                    return res.status(200).send(users);                // Devuelve un JSON
        }});
    },

    // Devuelve el usuario buscado
    selectOneUser: async (req, res) => {
        User.findOne({ username: req.params.name }, { __v: false })
            .populate('offered',{ __v: false }).populate('received', { __v: false })
            .exec( function (err, user) {
                if(err) {
                    console.log(err);
                    return res.status(202).send({'result': 'ERROR'});  // Devuelve un JSON
                }else{
                    return res.status(200).send(user);                 // Devuelve un JSON
                }
            }
        );
    },

    // Actualiza la información de un usuario
    updateUser: async (req, res) => {
        User.update({ username: req.params.name }, req.body, function(err) {
            if (err) {
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});       // Devuelve un JSON
        } else{
            return res.status(200).send({'result': 'ACTUALIZADO'}); // Devuelve un JSON
        }
    });},

    // Elimina de la Base de Datos el usuario buscado
    deleteUser: async (req, res) => {
        User.remove({ username: req.params.name }, function(err) {
            if(err){
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});     // Devuelve un JSON
            }else{
                return res.status(200).send({'result': 'ELIMINADO'}); // Devuelve un JSON
            }
        });
    },

  // Devuelve un usuario por su id
  getUserById: async (req, res) => {
    User.findOne({ _id: req.body.id }, { __v: false })
      .populate('offered',{ __v: false }).populate('received', { __v: false })
      .exec(function (err, user) {
          if(err) {
            console.log(err);
            return res.status(202).send({'result': 'ERROR'});  // Devuelve un JSON
          }else{
            return res.status(200).send(user);                 // Devuelve un JSON
          }
        }
      );
  }
};

