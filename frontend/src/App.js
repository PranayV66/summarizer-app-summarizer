import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

const BACKEND_URL = `http://3.209.77.92:9000`;

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [error, setError] = useState(null); // State to handle errors

    // Axios instance with default configurations
    const axiosInstance = axios.create({
      baseURL: BACKEND_URL,
      withCredentials: true, // Ensures cookies are sent with every request
    });
  
    // Fetch chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get('/chats');
        console.log('Chats fetched:', response.data);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Failed to load chats. Please try again.');
      }
    };

    // Check if token cookie exists
    const token = Cookies.get('token');
    if (token) {
      fetchChats();
    } else {
      console.log('No authentication token found.');
      setError('You are not logged in. Please log in to view your chats.');
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (!newChatTitle.trim()) return;

    try {
      const response = await axiosInstance.post('/chats', { title: newChatTitle });
      console.log('Chat created:', response.data);
      setChats((prevChats) => [response.data, ...prevChats]);
      setNewChatTitle('');
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create chat. Please try again.');
    }
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
      </div>
      <ChatWindow chat={selectedChat} />
    </div>
  );
}

export default App;