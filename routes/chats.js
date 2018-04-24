const router = require('express-promise-router')();
const chat = require('../controllers/chat');

router.post('/select', chat.getChat);          // Obtiene un chat
router.post('/', chat.getUserChats);           // Obtiene los chats de un usuario
router.post('/add', chat.addChatToUsers);      // añade un chat
router.post('/delete', chat.deleteChat);       // borra un chat

module.exports = router;