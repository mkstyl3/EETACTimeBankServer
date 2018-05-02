'use strict'

const path    = require   ('path');
const fs      = require   ('fs');
const moment  = require   ('moment')
const pagin   = require   ('mongoose-pagination');

const User                = require   ('../models/user');
const ActivityRequest     = require   ('../models/activityRequest');
const Activity            = require   ('../models/activity');
const Publication         = require   ('../models/publication');


exports.savePublication = function(req, res) {
    var params     = req.body;
    if(!params.text) return res.status(200).send({message: 'text required'});
    var publication         = new Publication();
        publication.text    = params.text;
        publication.author  = params.author;
        publication.date    = moment().unix();

        publication.save((err, publicationStored) =>{
            if(err)                return res.status(500).send({message: 'error al guardar'});
            if(!publicationStored) return res.status(404).send({message: 'publicacio no guardada'});
            console.log(publicationStored.author);

            return res.status(200).send({publication: publicationStored});
        });

}

exports.getPublications = function (req, res) {
    var page = 1;
    var itermPerPage = 4;

    if(req.params.page){
        page= req.params.page;
    }

    Publication.find({}).sort('date').populate('author').paginate(page, itermPerPage, (err, publications, total) =>{
        if(err)             return res.status(500).send({message:`error al realizar la petición: ${err} `});
        if(!publications)   return res.status(404).send({message: `no hi han publicacions      : ${err}`});


        res.status(200).send({total: total, pages: Math.ceil(total / itermPerPage), publications:publications})   ;
    })

};