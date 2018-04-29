'use strict'

const router           = require('express-promise-router')();
const publication      = require('../controllers/publication');

const multipart    = require('connect-multiparty');
const md_upload    = multipart({uploadDir: '../uploads/publications'});

router.post      ('/',          publication.savePublication);
router.get       ('/:page?',    publication.getPublications);



module.exports = router;
