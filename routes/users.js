const router = require('express-promise-router')();
const user = require('../controllers/user');
const passport = require('passport');
const passportConfig = require('../passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

// Funciones sobre Usuarios
router.route('/secret').get(passport.authenticate('jwt', { session: false }), user.secret);
router.route('/signup').post(validateBody(schemas.signUp), user.signUp);
router.route('/signin').post(validateBody(schemas.signIn),
    passport.authenticate('local', { session: false }), user.signIn);

router.get('/', passport.authenticate('jwt', { session: false }), user.selectAllUsers);             // Devuelve una lista con todos los usuarios
router.get('/:name', passport.authenticate('jwt', { session: false }), user.selectOneUser);         // Devuelve el usuario buscado
//router.post('/', user.insertUser);                                                                // Inserta un nuevo usuario (username único)
router.put('/:name', passport.authenticate('jwt', { session: false }), user.updateUser);            // Actualiza la información de un usuario
router.delete('/:name', passport.authenticate('jwt', { session: false }), user.deleteUser);         // Elimina de la Base de Datos el usuario buscado
router.post('/getUserById', passport.authenticate('jwt', { session: false }), user.getUserById);    // Devuelve un usuario por su id que es unica


//Put this in Header data key: 'Authorization', value: token (in session storage)

module.exports = router;
//updateActivity