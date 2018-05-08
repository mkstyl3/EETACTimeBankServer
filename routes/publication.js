'use strict'
const passport = require('passport');
const router           = require('express-promise-router')();
const publication      = require('../controllers/publication');

const multipart    = require('connect-multiparty');
const md_upload    = multipart({uploadDir: '../uploads/publications'});

router.post      ('/', passport.authenticate('jwt', { session: false }),         publication.savePublication);
router.get       ('/:page?', passport.authenticate('jwt', { session: false }),   publication.getPublications);



module.exports = router;
