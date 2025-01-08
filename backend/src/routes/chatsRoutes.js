const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');

router.post('/', chatsController.createChat);
router.get('/', chatsController.getUserChats);

module.exports = router;