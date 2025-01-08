import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

const BACKEND_URL = `http://3.209.77.92:9000`;

function App() {
  const [token, setToken] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');

  useEffect(() => {
    const jwtToken = Cookies.get('token');
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    console.log('Fetching chats with token:', token);
    axios.get(`${BACKEND_URL}/chats`, {
      withCredentials: true, // Include cookies
    })
    .then(res => {
      console.log('Chats fetched:', res.data);
      setChats(res.data);
    })
    .catch(err => console.error('Error fetching chats:', err));
  }, [token]);

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
      <div style={{ width: '250px', borderRight: '1px solid #ccc' }}>
        <h3>My Chats</h3>
        <form onSubmit={handleCreateChat}>
          <input
            type="text"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="New chat title"
            style={{ width: '80%', marginRight: '8px' }}
          />
          <button type="submit">Create</button>
        </form>
        <ChatList chats={chats} onSelectChat={handleSelectChat} />
      </div>
      <ChatWindow chat={selectedChat} token={token} />
    </div>
  );
}

export default App;