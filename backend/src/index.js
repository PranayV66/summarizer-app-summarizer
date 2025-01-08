require('dotenv').config({ path: '../../../.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authMiddleware = require('./middleware/auth');
const chatsRoutes = require('./routes/chatsRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const app = express();
const origin = `http://${process.env.APP_DOMAIN}:3000`;

// Configure CORS to allow credentials and specify origin
app.use(cors({
  origin: origin,
  credentials: true, // Allow cookies to be sent
}));

// Add Morgan logging middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
// Apply auth middleware globally
app.use(authMiddleware);
app.use('/chats', chatsRoutes);
app.use('/chats', messagesRoutes);
app.get('/', (req, res) => {
  res.send('Summarizer backend is running');
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});