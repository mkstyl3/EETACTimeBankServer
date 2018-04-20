const router = require('express-promise-router')();
const activity = require('../controllers/activity');

// Funciones sobre Actividades
router.get('/select', activity.selectAllActivities);   // Devuelve una lista con todas las actividades
router.get('/select/:id', activity.selectOneActivity); // Devuelve las actividad buscada
router.post('/insert', activity.insertActivity);       // Inserta una nueva actividad
router.post('/update/:id', activity.updateActivity);   // Actualiza la información de una actividad
router.get('/delete/:id', activity.deleteActivity);    // Elimina de la Base de Datos la actividad buscada

module.exports = router;