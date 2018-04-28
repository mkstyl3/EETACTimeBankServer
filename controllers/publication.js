'use strict'

var path    = require   ('path');
var fs      = require   ('fs');
var moment  = require   ('moment')
var pagin   = require   ('mongoose-pagination');

var User                = require   ('../models/user');
var ActivityRequest     = require   ('../models/activityRequest');
var Activity            = require   ('../models/activity');
var Publication         = require   ('../models/publication');


exports.savePublication = function(req, res) {
    var params     = req.body;
    if(!params.text) return res.status(200).send({message: 'text required'});
    var publication      = new Publication();
        publication.text = params.text;
        publication.user = params.author;
        publication.date = moment().unix();

        publication.save((err, publicationStored) =>{
            if(err)                return res.status(500).send({message: 'error al guardar'});
            if(!publicationStored) return res.status(404).send({message: 'publicacio no guardada'});

            return res.status(200).send({publication: publicationStored});

        });

}