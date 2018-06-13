const router = require('express-promise-router')();
const chat = require('../controllers/chat');
const passport = require('passport');

router.get('/messages/:id/:idUser', passport.authenticate('jwt', { session: false }),  chat.getChatMessages);          // Obtiene un chat
router.get('/users/:id/:idUser', passport.authenticate('jwt', { session: false }),  chat.getChatUsers);          // Obtiene un chat
router.get('/:id', passport.authenticate('jwt', { session: false }), chat.getUserChats);           // Obtiene los chats de un usuario
router.post('/add', passport.authenticate('jwt', { session: false }), chat.addChatToUsers);      // añade un chat
router.post('/delete', passport.authenticate('jwt', { session: false }), chat.deleteChat);       // borra un chat
router.post('/saveTest', passport.authenticate('jwt', { session: false }), chat.saveTestChat);
//router.post('/messageToChat',chat.saveMessageToChat);// save a message to chat
module.exports = router;