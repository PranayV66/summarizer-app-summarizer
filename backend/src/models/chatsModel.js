const pool = require('../config/db');

async function createChat(userId, title) {
  const [result] = await pool.query(
    `INSERT INTO chats (user_id, title)
     VALUES (?, ?)`,
    [userId, title || null]
  );
  const insertedId = result.insertId;

  const [rows] = await pool.query(`SELECT * FROM chats WHERE chat_id = ?`, [insertedId]);
  return rows[0];
}

async function getChatsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function getChatById(chatId) {
  const [rows] = await pool.query(
    `SELECT * FROM chats WHERE chat_id = ?`,
    [chatId]
  );
  return rows[0] || null;
}

module.exports = {
  createChat,
  getChatsByUser,
  getChatById
};