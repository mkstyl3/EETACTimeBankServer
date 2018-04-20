const router = require('express-promise-router')();
const user = require('../controllers/user');

// Funciones sobre Usuarios
router.post('/signIn', user.signIn);
router.get('/select', user.selectAllUsers);       // Devuelve una lista con todos los usuarios
router.get('/select/:name', user.selectOneUser);  // Devuelve el usuario buscado
router.post('/insert', user.insertUser);          // Inserta un nuevo usuario (username único)
router.post('/update/:name', user.updateUser);    // Actualiza la información de un usuario
router.get('/delete/:name', user.deleteUser);     // Elimina de la Base de Datos el usuario buscado

module.exports = router;
