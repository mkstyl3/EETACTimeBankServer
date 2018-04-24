const router = require('express-promise-router')();
const activityRequest = require('../controllers/activityRequest');

// Funciones sobre Actividades
router.get('/', activityRequest.selectAllActivities);  // Devuelve una lista con todas las actividades
router.get('/:id', activityRequest.selectOneActivity); // Devuelve las actividad buscada
router.post('/', activityRequest.insertActivity);      // Inserta una nueva actividad
router.put('/:id', activityRequest.updateActivity);    // Actualiza la información de una actividad
router.delete('/:id', activityRequest.deleteActivity); // Elimina de la Base de Datos la actividad buscada

module.exports = router;