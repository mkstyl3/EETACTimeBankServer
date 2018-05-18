'use strict'

const ActivityRequest = require('../models/activityRequest');
const User = require('../models/user');
const Activity = require('../models/activity');

const mongoosePaginate = require('mongoose-pagination');

module.exports = function (io) {
    var func = {};
    // Devuelve una peticio
    func.getRequest = function (req, res) {
        let requestId = req.params.id
        console.log(requestId)

        ActivityRequest.findById(requestId, (err, request) => {
            if (err) return res.status(500).send({ message: `error al realitzar la petició: ${err}` })
            if (request) return res.status(404).send({ message: `la peticio no existeix: ${err}` })

            res.status(200).send({ request: request })
        })
    };

    // torna totes les peticions
    func.getRequests = function (req, res) {
        ActivityRequest.find({}, (err, requests) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: `error al realizar la petición: ${err} ` })
            }
            if (!requests) return res.status(404).send({ message: `el array de peticions no existe: ${err}` })

            res.status(200).send(requests)

        })
    };

    // Inserta una nova peticio
    func.insertActivityRequest = function (req, res) {
        console.log(req.bodyParser)
        //afegint a la BD
        let activityRequest = new ActivityRequest()
        activityRequest.userFrom = req.body.userFrom
        activityRequest.userTo = req.body.userTo
        activityRequest.activity = req.body.activity


        activityRequest.save((err, requestStored) => {
            if (err) res.status(200).send({ message: `error en salvar la BD: ${err}` })
            res.status(200).send({ activityRequest: requestStored })
        })
    };

    func.insertActivityRequestFromName = async function (req, res) {
        console.log(req.bodyParser)
        let userFrom = await User.findOne({ 'username': req.body.userFrom });
        let userTo = await User.findOne({ 'username': req.body.userTo });
        let activity = await Activity.findOne({ '_id': req.body.activity });

        if (!userTo && !userFrom) {
            res.status(200).send({ message: `error en salvar la BD: no existen los usuarios` });
            return;
        }

        let activityRequest = new ActivityRequest()
        activityRequest.userFrom = userFrom._id;
        activityRequest.userTo = userTo._id;
        activityRequest.activity = req.body.activity;
        console.log(userTo.socketId);
        for (var i = 0; i < userTo.socketId.length; i++) {
            io.to(userTo.socketId[i]).emit('notification',
                { 'type': 'newActivityRequestTo', 'activityname': activity.name, 'username': userTo.username })
        }
        try {
            var requestStored = await activityRequest.save();
            var requestFull = await ActivityRequest.findById(requestStored.id).populate('userTo', 'username').populate('userFrom', 'username').populate('activity');
            console.log(requestFull);
            for (var i = 0; i < userTo.socketId.length; i++) {
                io.to(userTo.socketId[i]).emit('notNewReq', requestFull)
            }
            for (var i = 0; i < userFrom.socketId.length; i++) {
                io.to(userFrom.socketId[i]).emit('notNewReq', requestFull)
            }
            res.status(200).send({ activityRequest: requestStored })
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ message: `error en salvar la BD: ${err}` })
        }
    };

    // Actualiza la información de una petició
    func.updateRequest = function (req, res) {
        let requestId = req.params.requestId
        let update = req.body

        activityRequest.findByidandUpdate(requestId, update, (err, requestUpdated) => {
            if (err) return res.status(500).send({ message: `error al actualitzar la peticio ${err} ` })
            res.status(200).send({ tag: requestUpdated })
        })
    };

    // Elimina una petició
    func.deleteActivityRequest = async function (req, res) {
        let requestId = req.params.id
        let request = await ActivityRequest.findById(requestId)
        if (!request) res.status(500).send({ message: `error al realizar la petición` })

        let userTo = await User.findOne({ '_id': request.userTo });
        let userFrom = await User.findOne({ '_id': request.userFrom });
        let activity = await Activity.findOne({ '_id': request.activity });
        try {
            request.remove();
            if (userTo && userFrom) {
                for (var i = 0; i < userTo.socketId.length; i++) {
                    io.to(userTo.socketId[i]).emit('notDelReq', { 'id': request._id });
                    io.to(userTo.socketId[i]).emit('notification',
                        { type: 'deleteRequest', activityname: activity.name, 'username': userTo.username });
                }
                for (var i = 0; i < userFrom.socketId.length; i++) {
                    io.to(userFrom.socketId[i]).emit('notDelReq', { 'id': request._id });
                    io.to(userFrom.socketId[i]).emit('notification',
                        { type: 'deleteRequest', activityname: activity.name, 'username': userFrom.username });
                }
            }
            res.status(200).send({ message: `peticio eliminada` })
        } catch (err) {
            res.status(500).send({ message: `error al borrar la petició: ${err} ` })
        }
    };


    //llistat paginat dels usuaris que tenen una peticio meva
    func.getRequestsPag = function (req, res) {
        let userId = req.params.id
        ActivityRequest.find({ userFrom: userId })
            .populate({ path: 'activity' })
            .populate({ path: 'userTo' })
            .exec(function (err2, req2) {
                if (err2) return res.status(500).send({ message: `error al realitzar la petició: ${err2}` });
                if (!req2) return res.status(404).send({ message: `la peticio no existeix: ${err2}` });

                res.status(200).send(req2);
            })
    };

    //llista paginada dels usuaris que m'han fet una peticio
    func.getPetitions = function (req, res) {
        let userId = req.params.id

        ActivityRequest.find({ userTo: userId })
            .populate('userFrom')
            .populate('userTo')
            .populate('activity')
            .exec(function (err2, req2) {
                if (err2) return res.status(500).send({ message: `error al realitzar la petició: ${err2}` });
                if (!req2) return res.status(404).send({ message: `no tens cap peticio: ${err2}` });

                res.status(200).send(req2);
            })

    };

    func.acceptRequest = async function (req, res) {
        console.log(req.body);
        let request = await ActivityRequest.findOne({ '_id': req.body.id });
        if (request) {
            request.accepted = true;
            request.save();
            let userFrom = await User.findById(request.userFrom);
            let activity = await Activity.findById(request.activity);
            if (userFrom && activity) {
                for (var i = 0; i < userFrom.socketId.length; i++) {
                    io.to(userFrom.socketId[i]).emit('notification',
                        { type: 'acceptRequest', activityname: activity.name, 'username': userFrom.username });
                    io.to(userFrom.socketId[i]).emit('notAccReq', { 'id': request._id });
                }
            }
            res.status(200).send({ 'message': 'ok' });
        }
        else {
            res.status(404).send({ 'message': 'peticion no encontrada' });
        }
    }

    func.doneRequest = async function (req, res) {
        console.log(req.body);
        let request = await ActivityRequest.findOne({ '_id': req.body.id });
        if (request) {
            request.isDone = true;
            request.save();
            let userTo = await User.findById(request.userTo);
            userTo.wallet = userTo.wallet + activity.cost;
            userTo.save();
            let userFrom = await User.findOne({'_id':request.userFrom});
            userFrom.wallet = userFrom.wallet - activity.cost;
            userFrom.save()
            let activity = await Activity.findById(request.activity);
            if (userTo && activity) {
                for (var i = 0; i < userTo.socketId.length; i++) {
                    io.to(userTo.socketId[i]).emit('notification',
                        { type: 'doneRequest', activityname: activity.name, 'username': userTo.username });
                    io.to(userTo.socketId[i]).emit('notFinReq', { 'id': request._id });
                }
            }
            res.status(200).send({ 'message': 'ok' });
        }
        else {
            res.status(404).send({ 'message': 'peticion no encontrada' });
        }
    }
    func.getCounters = function (req, res) {
        let id = req.params.id
        getCountPetitions(id).then((value) => {
            return res.status(200).send(value);
            //console.log(value);
        })
            .catch((err) => {
                return 'error occured'
            });
    }
    async function getCountPetitions(id) {
        var petitions = await ActivityRequest.count({ "userTo": id }).exec();
        var requested = await ActivityRequest.count({ "userFrom": id }).exec();

        console.log("HOLA ", petitions);
        return {
            requested: requested, petitions: petitions
        }
    }
    return func;
}
