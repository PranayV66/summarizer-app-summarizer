const pool = require('../config/db');

async function createMessage(chatId, content) {
  const [result] = await pool.query(
    `INSERT INTO messages (chat_id, content)
     VALUES (?, ?, ?)`,
    [chatId, content]
  );
  const insertedId = result.insertId;

  const [rows] = await pool.query(`SELECT * FROM messages WHERE message_id = ?`, [insertedId]);
  return rows[0];
}

async function getMessagesByChat(chatId) {
  const [rows] = await pool.query(
    `SELECT * FROM messages
     WHERE chat_id = ?
     ORDER BY created_at ASC`,
    [chatId]
  );
  return rows;
}

module.exports = {
  createMessage,
  getMessagesByChat
};