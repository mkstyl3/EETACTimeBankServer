'use strict'

const ActivityRequest = require('../../EETACTimeBankServer/models/activityRequest');
const User             = require('../models/user');
const mongoosePaginate = require('mongoose-pagination');

// Devuelve una peticio
exports.getRequest = function (req, res) {
    let requestId = req.params.id
    console.log(requestId)

    ActivityRequest.findById(requestId, (err, request)=> {
        if(err)     return res.status(500).send({message: `error al realitzar la petició: ${err}`})
        if(request) return res.status(404).send({message: `la peticio no existeix: ${err}`})

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
        if(!requests)   return res.status(404).send({message: `el array de peticions no existe: ${err}`})

        res.status(200).send(requests)

    })
};

// Inserta una nova peticio
exports.insertActivityRequest = function (req, res) {
    console.log(req.bodyParser)
    //afegint a la BD
    let activityRequest = new ActivityRequest()
        activityRequest.userFrom    = req.body.userFrom
        activityRequest.userTo      = req.body.userTo
        activityRequest.activy      = req.body.activity


    activityRequest.save((err, requestStored) => {
        if(err) res.status(200).send({message:`error en salvar la BD: ${err}`})
        res.status(200).send({activityRequest: requestStored})
    })
};

// Actualiza la información de una petició
exports.updateRequest = function (req, res) {
    let requestId = req.params.requestId
    let update    = req.body

    activityRequest.findByidandUpdate( requestId, update, (err, requestUpdated) => {
        if(err)  return res.status(500).send({message:`error al actualitzar la peticio ${err} `})
        res.status(200).send({tag: requestUpdated})
    })
};

// Elimina una petició
exports.deleteActivityRequest = function (req, res) {
    let requestId = req.params.requestId
    ActivityRequest.finById(requestId, (err, request) =>{
        if (err)    res.status(500).send({message:`error al realizar la petición: ${err} `})

        request.remove(err => {
            if(err) res.status(500).send({message:`error al borrar la petició: ${err} `})

            res.status(200).send({message: `peticio eliminada` })

        })
    })
};


//llistat paginat dels usuaris que tenen una peticio meva
exports.getRequestsPag = function(req, res){
    let userId = req.params.id
    var page = 1;
    var itemsPage = 4;

    if(req.params.page){
        page = req.params.page;
    }
    ActivityRequest.find({userFrom: userId}).populate({path: 'userTo'}).paginate(page, itemsPage, (err, req, total ) => {
            if (err)  return res.status(500).send({message: `error al realitzar la petició: ${err}`});
            if (!req) return res.status(404).send({message: `la peticio no existeix: ${err}`});

            res.status(200).send({total: total, pages: Math.ceil(total / itemsPage), req: req});

    })
};

//llista paginada dels usuaris que m0han fet una peticio
exports.getPetitions = function (req, res) {
    let userId = req.params.id
    var page = 1;
    var itemsPage = 4;

    ActivityRequest.find({userTo: userId}).populate({path: 'userFrom'}).paginate(page, itemsPage, (err, req, total ) => {
        if (err)  return res.status(500).send({message: `error al realitzar la petició: ${err}`});
        if (!req) return res.status(404).send({message: `no tens cap peticio: ${err}`});

        res.status(200).send({total: total, pages: Math.ceil(total / itemsPage), req: req});


    })
    
};

//contadors
exports.getCounters = function (req, res) {
    let id = req.params.id
    getCountPetitions(id).then((value)=>{
        return res.status(200).send(value);
        //console.log(value);
    });
}
    async function getCountPetitions(id) {

        var petitions = await ActivityRequest.count({"userTo":id}).exec((err, count) => {
            if (err)  return handleError(err);
            console.log(count)
             return count;
        });

        var requested = await ActivityRequest.count({"userFrom":id}).exec((err, count) => {
            if (err) return handleError(err);
            console.log(count)
            return count;
        });
        console.log(petitions);
        return {
            requested: requested, petitions: petitions
        }
    }