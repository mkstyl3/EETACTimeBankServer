const router = require('express-promise-router')();
const user = require('../controllers/users');

/* GET users listing. */
router.get('/test', function(req, res, next) {
    console.log('respond with a resource');
});

router.post('/insert', user.insertUser);

router.post('/signIn', user.signIn);

router.post('/allUsers', user.getUsers);

module.exports = router;
