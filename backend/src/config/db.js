require('dotenv').config({ path: '../../../.env' });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  port: process.env.SQL_DB_PORT,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;