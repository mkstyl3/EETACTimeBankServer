const Activity = require('../../EETACTimeBankServer/models/activity');
const User = require('../../EETACTimeBankServer/models/user');
const FB = require('fb');

module.exports = function(io)
{
    let func={};
    func['io'] = io;
    func.selectAllActivities = function (req, res) {
        Activity.find({}, { __v: false })
          .populate('ratings.userId', 'name')
          .exec( function (err, activities) {
            if(err){
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});  // Devuelve un JSON
            }else{
                return res.status(200).send(activities);           // Devuelve un JSON
            }
        });
    };

    // Devuelve las actividad buscada
    func.selectOneActivity = function (req, res) {
        Activity.findOne({ _id: req.params.id }, { __v: false }, function (err, activity) {
            if(err){
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});  // Devuelve un JSON
            }else{
                return res.status(200).send(activity);             // Devuelve un JSON
            }
        });
    };

    // Inserta una nueva actividad
    func.insertActivity = function (req, res) {
        Activity(req.body).save(function (err,activity) {
            if(err){
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});     // Devuelve un JSON
            }else{
                console.log(req.body);
                User.findOne({username:req.body.user},{__v: false},function(err,user){
                    if(err){
                        return res.status(202).send({'result': 'ERROR'});
                    }
                    if(user.offered!=null)
                    {
                        user.offered.push(activity._id);
                        user.save();
                    }
                    else{
                        user.offered =[activity._id]
                        user.save();
                    }
                    if(user.socialProvider&&user.socialProvider==='facebook')
                    {
                        console.log('activiy de un usuari de facebook')
                        FB.setAccessToken(user.accessToken);
                        FB.api("/me/feed","POST",
                            {
                                "message":activity.name,
                                "message":activity.description
                            },
                            function (response) {
                                console.log('fas la peticio?',response)
                              if (response && !response.error) {
                                console.log('Post Id: ' + response.id);
                              }
                            }
                        );
                    }
                })
                io.sockets.emit('newActivity',activity);
                return res.status(201).send({'result': 'INSERTADO'}); // Devuelve un JSON
            }
        });
    };

    // Actualiza la información de una actividad
    func.updateActivity = function (req, res) {
        Activity.update({ _id: req.params.id }, req.body, function(err) {
            if (err) {
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});       // Devuelve un JSON
            }else{
                return res.status(200).send({'result': 'ACTUALIZADO'}); // Devuelve un JSON
            }
        });
    };

    // Elimina de la Base de Datos la actividad buscada
    func.deleteActivity = function (req, res) {
        Activity.remove({ _id: req.params.id }, function(err) {
            if(err){
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});     // Devuelve un JSON
            }else{
                return res.status(200).send({'result': 'ELIMINADO'}); // Devuelve un JSON
            }
        });
    };

    //populate

    func.populateActivities = function (req, res) {
        Activity.find({})
            /*.populate('user')*/
            .exec(function (err, activities) {
            if(err){
                console.log(err);
                return res.status(500).send({'result': 'ERROR'});
            }else{
                return res.status(200).send(activities);
            }
        });
    };

    func.deleteActivity = function (req, res) {
        Activity.remove({ _id: req.params.id }, function(err) {
            if(err){
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});     // Devuelve un JSON
            }else{
                return res.status(200).send({'result': 'ELIMINADO'}); // Devuelve un JSON
            }
        });
    }
    func.filtranombre = function (req, res) {
        console.log(req.body.latitude);
        console.log(req.body.distance);
        //Activity.find({ location: {$near: { $geometry: { type: "Point",  coordinates: [req.body.latitude,req.body.longitude ] },
         //           $maxDistance: req.body.distance*1000}} }, { __v: false }, function (err, activity) {
         Activity.find({$and:[{ location: {$near: { $geometry: { type: "Point",  coordinates: [req.body.latitude,req.body.longitude ] },
                         $maxDistance: req.body.distance*1000}} } ,{$or: [{ name: {$regex : ".*"+req.body.name+".*"} },
              { tags: {$regex : ".*"+req.body.name+".*"} },{ category: {$regex : ".*"+req.body.name+".*"} } ] }, {cost:{$lt: req.body.cost+1}}]}, { __v: false }, function (err, activity) {
        //Activity.find({$and: [{cost:{$lt: req.body.cost+1}},{$text: {$search: req.body.name}}]}, { __v: false }, function (err, activity) {
            if(err){
                console.log(err);
                return res.status(202).send({'result': 'ERROR'});  // Devuelve un JSON
            }else{
                //console.log(activity);
                return res.status(200).send(activity);             // Devuelve un JSON
            }
        });
        //return res.status(202).send({ 'category' : 'Musica', 'cost' : 1, 'description' : "qwe", 'imatge':'', 'latitude':123, 'longitude':123, 'name': '123', 'user':'juan','tags':{0:"material extra"}});
    }

    return func;
}
