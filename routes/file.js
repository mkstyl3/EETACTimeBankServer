const router = require('express-promise-router')();
const file = require('../controllers/file');
const passport = require('passport');

router.post('/',/* passport.authenticate('jwt', { session: false }),*/ file.postFile);          // Obtiene un chat
router.get('/:uuid',/* passport.authenticate('jwt', { session: false }),*/ file.getFile); 

module.exports = router;