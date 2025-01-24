import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import './App.css';

const BACKEND_URL = `http://34.236.217.66:30009`;

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/chats`, { withCredentials: true });
        console.log('Chats fetched:', response.data);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Failed to load chats. Please log in.');
      }
    };

    fetchChats();
  }, []);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleCreateChat = (e) => {
    e.preventDefault();
    if (!newChatTitle.trim()) return;

    console.log('Creating chat with title:', newChatTitle);
    axios.post(`${BACKEND_URL}/chats`, { title: newChatTitle }, {
      withCredentials: true,
    })
    .then(res => {
      console.log('Chat created:', res.data);
      setChats(prevChats => [res.data, ...prevChats]);
      setNewChatTitle('');
    })
    .catch(err => console.error('Error creating chat:', err));
  };

  return (
    <div className="App">
      <div className="chat-list-container">
      <h3 className="create-chat-header">Create New Chat</h3>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleCreateChat}>
          <input
            type="text"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="Title for your next chat"
            className="new-chat-input"
          />
          <button type="submit" className="create-chat-button">
            Create!
          </button>
        </form>
        <div className="chat-list-spacing">
          <ChatList chats={chats} onSelectChat={handleSelectChat} />
        </div>
        {chats.length === 0 && <p>No chats available. Create a new chat!</p>}
      </div>
      <div className="chat-window-container">
        <ChatWindow chat={selectedChat} />
      </div>
    </div>
  );
}

export default App;