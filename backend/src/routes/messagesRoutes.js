const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

// GET /chats/:chatId/messages
router.get('/:chatId/messages', messagesController.getChatMessages);

// POST /chats/:chatId/messages
router.post('/:chatId/messages', messagesController.addMessage);

module.exports = router;