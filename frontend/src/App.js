import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

const BACKEND_URL = `http://3.209.77.92:9000`;

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [error, setError] = useState(null);

  // Fetch chats on component mount
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
      withCredentials: true, // Include cookies
    })
    .then(res => {
      console.log('Chat created:', res.data);
      setChats(prevChats => [res.data, ...prevChats]);
      setNewChatTitle('');
    })
    .catch(err => console.error('Error creating chat:', err));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '16px' }}>
        <h3>My Chats</h3>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleCreateChat} style={{ marginBottom: '16px' }}>
          <input
            type="text"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="New chat title"
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '8px' }}>
            Create
          </button>
        </form>
        <ChatList chats={chats} onSelectChat={handleSelectChat} />
        {chats.length === 0 && <p>No chats available. Create a new chat!</p>}
      </div>
      <ChatWindow chat={selectedChat} />
    </div>
  );
}

export default App;