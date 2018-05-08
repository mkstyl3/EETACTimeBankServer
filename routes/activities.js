const router = require('express-promise-router')();
const activity = require('../controllers/activity');

// Funciones sobre Actividades
router.get('/', activity.selectAllActivities);  // Devuelve una lista con todas las actividades
router.get('/novetats', activity.populateActivities);

router.get('/:id', activity.selectOneActivity); // Devuelve las actividad buscada
router.post('/', activity.insertActivity);      // Inserta una nueva actividad
router.put('/:id', activity.updateActivity);    // Actualiza la información de una actividad
router.delete('/:id', activity.deleteActivity); // Elimina de la Base de Datos la actividad buscada

module.exports = router;