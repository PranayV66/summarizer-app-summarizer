const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authMiddleware = require('./middleware/auth');
const chatsRoutes = require('./routes/chatsRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const app = express();
// const origin = `http://${process.env.APP_DOMAIN}:30008`;
const origin = `http://${process.env.APP_DOMAIN}`;

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
app.use('/api/chats', chatsRoutes);
app.use('/api/chats', messagesRoutes);
app.get('/api', (req, res) => {
  res.send('Summarizer backend is running');
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});