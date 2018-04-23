const router = require('express-promise-router')();
const user = require('../controllers/user');

// Funciones sobre Usuarios
router.post('/signIn', user.signIn);       // Autentifica el usuario en el sistema
router.get('/', user.selectAllUsers);      // Devuelve una lista con todos los usuarios
router.get('/:name', user.selectOneUser);  // Devuelve el usuario buscado
router.post('/', user.insertUser);         // Inserta un nuevo usuario (username único)
router.put('/:name', user.updateUser);     // Actualiza la información de un usuario
router.delete('/:name', user.deleteUser);  // Elimina de la Base de Datos el usuario buscado

module.exports = router;
