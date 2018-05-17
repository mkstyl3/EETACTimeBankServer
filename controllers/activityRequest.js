'use strict'

const ActivityRequest = require('../models/activityRequest');
const User             = require('../models/user');
const Activity         = require('../models/activity');

const mongoosePaginate = require('mongoose-pagination');

// Devuelve una peticio
exports.getRequest = function (req, res) {
    let requestId = req.params.id;
    console.log(requestId);

    ActivityRequest.findById(requestId, (err, request)=> {
        if(err)     return res.status(500).send({message: `error al realitzar la petició: ${err}`});
        if(request) return res.status(404).send({message: `la peticio no existeix: ${err}`});

        res.status(200).send({request: request})
    })
};

// torna totes les peticions
exports.getRequests = function (req, res) {
    ActivityRequest.find({}, (err, requests ) => {
        if(err) {
            console.log(err);
            return res.status(500).send({message:`error al realizar la petición: ${err} `})
        }
        if(!requests)   return res.status(404).send({message: `el array de peticions no existe: ${err}`});

        res.status(200).send(requests)

    })
};

// Inserta una nova peticio
exports.insertActivityRequest = function (req, res) {
    console.log(req.bodyParser);
    //afegint a la BD
    let activityRequest = new ActivityRequest();
        activityRequest.userFrom    = req.body.userFrom;
        activityRequest.userTo      = req.body.userTo;
        activityRequest.activity      = req.body.activity;


    activityRequest.save((err, requestStored) => {
        if(err) res.status(200).send({message:`error en salvar la BD: ${err}`});
        res.status(200).send({activityRequest: requestStored})
    })
};

exports.insertActivityRequestFromName = async function (req, res) {
    console.log(req.bodyParser);
    let userFrom = await User.findOne({'username':req.body.userFrom});
    let userTo = await User.findOne({'username':req.body.userTo});

    if(!userTo&&!userFrom)
    {
        res.status(200).send({message:`error en salvar la BD: no existen los usuarios`});
        return;
    }

    let activityRequest = new ActivityRequest();
        activityRequest.userFrom    = userFrom.id;
        activityRequest.userTo      = userTo.id;
        activityRequest.activity      = req.body.activity;


    activityRequest.save((err, requestStored) => {
        if(err) res.status(200).send({message:`error en salvar la BD: ${err}`});
        res.status(200).send({activityRequest: requestStored})
    })
};

// Actualiza la información de una petició
exports.updateRequest = function (req, res) {
    let requestId = req.params.requestId;
    let update    = req.body;

    activityRequest.findByidandUpdate( requestId, update, (err, requestUpdated) => {
        if(err)  return res.status(500).send({message:`error al actualitzar la peticio ${err} `});
        res.status(200).send({tag: requestUpdated})
    })
};

// Elimina una petició
exports.deleteActivityRequest = function (req, res) {
    let requestId = req.params.id;
    ActivityRequest.findById(requestId, (err, request) =>{
        if (err)    res.status(500).send({message:`error al realizar la petición: ${err} `});

        request.remove(err => {
            if(err) res.status(500).send({message:`error al borrar la petició: ${err} `});

            res.status(200).send({message: `peticio eliminada` })

        })
    })
};


//llistat paginat dels usuaris que tenen una peticio meva
exports.getRequestsPag = function(req, res){
    let userId = req.params.id;
    ActivityRequest.find({userFrom: userId})
                   .populate({path: 'activity'})
                   .populate({path: 'userTo'})
                   .exec( function (err2, req2) {
                        if (err2)  return res.status(500).send({message: `error al realitzar la petició: ${err2}`});
                        if (!req2) return res.status(404).send({message: `la peticio no existeix: ${err2}`});

                    res.status(200).send(req2);
    })
};

//llista paginada dels usuaris que m'han fet una peticio
exports.getPetitions = function (req, res) {
    let userId = req.params.id;

    ActivityRequest.find({userTo: userId})
                   .populate('userFrom')
                   .populate('userTo')
                   .populate('activity')
                   .exec(function (err2, req2 ){
                        if (err2)  return res.status(500).send({message: `error al realitzar la petició: ${err2}`});
                        if (!req2) return res.status(404).send({message: `no tens cap peticio: ${err2}`});

                       res.status(200).send(req2);
    })

};

exports.acceptRequest = async function (req,res){
    console.log(req.body);
    let request = await ActivityRequest.findOne({'_id':req.body.id});
    if(request){
        request.accepted = true;
        request.save();
        res.status(200).send({'message':'ok'});
    }
    else{
        res.status(404).send({'message':'peticion no encontrada'});
    }
};

exports.doneRequest = async function (req,res){
    console.log(req.body);
    let request = await ActivityRequest.findOne({'_id':req.body.id});
    if(request){
      request.isDone = true;
      request.save();

      let activity = await Activity.findOne({'_id':request.activity});
      let userFrom = await User.findOne({'_id':request.userFrom});
      userFrom.wallet = userFrom.wallet - activity.cost;

      let userTo = await User.findOne({'_id':request.userTo});
      userTo.wallet = userTo.wallet + activity.cost;

      userFrom.save();
      userTo.save();

      res.status(200).send({'message':'ok'});
    }
    else{
        res.status(404).send({'message':'peticion no encontrada'});
    }
};

//contadors
exports.getCounters = function (req, res) {
    let id = req.params.id;
    getCountPetitions(id).then((value)=>{
        return res.status(200).send(value);
        //console.log(value);
    })
        .catch((err) => {
            return 'error occured'
    });
};
    async function getCountPetitions(id) {



               /* var petitions = await
                    ActivityRequest.count({"userTo":id}).exec((err, count) => {
                    if (err)  return handleError(err);
                    console.log(count)
                    return count;
                });

                var requested = await
                    ActivityRequest.count({"userFrom":id}).exec((err, count) => {
                    if (err) return handleError(err);
                    console.log(count)
                    return count;
                });*/

        var petitions = await ActivityRequest.count({"userTo":id}).exec();
        var requested = await ActivityRequest.count({"userFrom":id}).exec();

                console.log("HOLA ", petitions);
                return {
                    requested: requested, petitions: petitions
                }
    }

