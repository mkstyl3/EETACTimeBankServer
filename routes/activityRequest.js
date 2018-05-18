'use strict'
const router = require('express-promise-router')();
const passport = require('passport');

module.exports = function (io) {
    var activityRequest = require('../controllers/activityRequest')(io);
    // Funciones sobre peticions
    router.get('/', passport.authenticate('jwt', { session: false }), activityRequest.getRequests);
    router.get('/requested/:id', passport.authenticate('jwt', { session: false }), activityRequest.getRequestsPag);
    router.get('/petitions/:id', passport.authenticate('jwt', { session: false }), activityRequest.getPetitions);
    router.get('/count/:id', passport.authenticate('jwt', { session: false }), activityRequest.getCounters);

    router.get('/:id', passport.authenticate('jwt', { session: false }), activityRequest.getRequest);
    router.post('/', passport.authenticate('jwt', { session: false }), activityRequest.insertActivityRequest);
    router.post('/fromname', passport.authenticate('jwt', { session: false }), activityRequest.insertActivityRequestFromName);
    router.put('/accept', passport.authenticate('jwt', { session: false }), activityRequest.acceptRequest);
    router.put('/done', passport.authenticate('jwt', { session: false }), activityRequest.doneRequest);
    router.put('/:id', passport.authenticate('jwt', { session: false }), activityRequest.updateRequest);
    router.delete('/:id', passport.authenticate('jwt', { session: false }), activityRequest.deleteActivityRequest);

    return router;
}