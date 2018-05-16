const router = require('express-promise-router')();
const passport = require('passport');

module.exports = function (socket) {

    let activity = require('../controllers/activity')(socket);
    // Funciones sobre Actividadesç
    router.get('/novetats', passport.authenticate('jwt', { session: false }), activity.populateActivities);
    router.get('/', passport.authenticate('jwt', { session: false }), activity.selectAllActivities);  // Devuelve una lista con todas las actividades
    router.get('/:id', passport.authenticate('jwt', { session: false }), activity.selectOneActivity); // Devuelve las actividad buscada
    router.post('/', passport.authenticate('jwt', { session: false }), activity.insertActivity);      // Inserta una nueva actividad
    router.put('/:id', passport.authenticate('jwt', { session: false }), activity.updateActivity);    // Actualiza la información de una actividad
    router.delete('/:id', passport.authenticate('jwt', { session: false }), activity.deleteActivity); // Elimina de la Base de Datos la actividad buscada
    return router;
};