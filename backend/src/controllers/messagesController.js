const chatsModel = require('../models/chatsModel');
const messagesModel = require('../models/messagesModel');
const axios = require('axios');

async function getChatMessages(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await chatsModel.getChatById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    if (chat.user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const messages = await messagesModel.getMessagesByChat(chatId);
    return res.json(messages);
  } catch (error) {
    console.error('getChatMessages error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function addMessage(req, res) {
  try {
    const { chatId } = req.params;
    const { userText } = req.body;
    console.log("userText:", userText);
    const chat = await chatsModel.getChatById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    if (chat.user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // 1) Create user message
    const userMsg = await messagesModel.createMessage(chatId, userText);
    // 2) Call LLM container
    const llmResponse = await axios.post(
      'http://summarize-ai-llm-svc:11434/api/generate',
      { model: 'llama3.2', prompt: userText },
      { timeout: 300000 },
      { responseType: 'text' }
    );

    // 3) Extract assistant reply as a clean string
      let assistantText = '';
      const jsonResponses = llmResponse.data.match(/{[^}]*}/g);
      if (jsonResponses) {
        jsonResponses.forEach(responseStr => {
          try {
            const parsed = JSON.parse(responseStr);
            assistantText += parsed.response || '';
          } catch (err) {
            console.error('JSON parse error:', err);
          }
        });
      } else {
        assistantText = llmResponse.data.trim();
      }
      console.log("assistantText:", assistantText);

    // 4) Store assistant reply
    const assistantMsg = await messagesModel.createMessage(chatId, assistantText);
    console.log("assistantMsg:", assistantMsg);

    return res.status(201).json({ userMsg, assistantMsg });
  } catch (error) {
    console.error('addMessage error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getChatMessages,
  addMessage
};