const router = require('express-promise-router')();
const user = require('../controllers/user');
const passport = require('passport');
const passportConfig = require('../passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');


// Funciones sobre Usuarios
router.get('/select', user.selectAllUsers);       // Devuelve una lista con todos los usuarios
router.get('/select/:name', user.selectOneUser);  // Devuelve el usuario buscado
router.post('/update/:name', user.updateUser);    // Actualiza la información de un usuario
router.get('/delete/:name', user.deleteUser);     // Elimina de la Base de Datos el usuario buscado

//Put this in Header data key: 'Authorization', value: token (in session storage)
router.route('/secret')
    .get(passport.authenticate('jwt', { session: false }), user.secret);    

router.route('/signup')
    .post(validateBody(schemas.signUp), user.signUp);

router.route('/signin')
    .post(validateBody(schemas.signIn), passport.authenticate('local', { session: false }), user.signIn);


    module.exports = router;
