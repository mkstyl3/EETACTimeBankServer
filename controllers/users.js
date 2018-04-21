const User = require('../../EETACTimeBankServer/models/user');

//read methods
exports.getUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err)
            res.send(err);
        res.json(users);
    });
};

//insert methods
exports.insertUser = function(req, res) {
    let newUser = new User(req.body);
    newUser.save(function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
        console.log(err + user);
    });
};
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