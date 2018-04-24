const ActivityRequest = require('../../EETACTimeBankServer/models/activityRequest');


// Devuelve una peticio
exports.getRequest = function (req, res) {
    let requestId = req.params.requestId

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