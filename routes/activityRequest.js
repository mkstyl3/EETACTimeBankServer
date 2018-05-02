'use strict'
const router          = require('express-promise-router')();
const activityRequest = require('../controllers/activityRequest');


// Funciones sobre peticions
router.get      ('/',    activityRequest.getRequests);
router.get      ('/requested/:id',    activityRequest.getRequestsPag);
router.get      ('/petitions/:id',    activityRequest.getPetitions);
router.get      ('/count/:id',        activityRequest.getCounters);


router.get      ('/:id', activityRequest.getRequest);
router.post     ('/',    activityRequest.insertActivityRequest);
router.put      ('/:id', activityRequest.updateRequest);
router.delete   ('/:id', activityRequest.deleteActivityRequest);

module.exports = router;