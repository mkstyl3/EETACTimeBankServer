const router = require('express-promise-router')();
const chat = require('../controllers/chat');

router.get('/:id', chat.getChat);          // Obtiene un chat
router.get('/', chat.getUserChats);           // Obtiene los chats de un usuario
router.post('/add', chat.addChatToUsers);      // añade un chat
router.post('/delete', chat.deleteChat);       // borra un chat
router.post('/saveTest',chat.saveTestChat);
//router.post('/messageToChat',chat.saveMessageToChat);// save a message to chat
module.exports = router;