const chatsModel = require('../models/chatsModel');

async function createChat(req, res) {
  try {
    const userId = req.user.user_id; // from auth middleware
    const { title } = req.body;
    const newChat = await chatsModel.createChat(userId, title);
    return res.status(201).json(newChat);
  } 
  catch (error) {
    console.error('createChat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserChats(req, res) {
  try {
    const userId = req.user.user_id;
    const chats = await chatsModel.getChatsByUser(userId);
    return res.status(200).json(chats);
  } 
  catch (error) {
    console.error('getUserChats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createChat,
  getUserChats
};