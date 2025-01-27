import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageInput from './MessageInput';
import '../ChatWindow.css';

function ChatWindow({ chat }) {
  const [messages, setMessages] = useState([]);
  const axiosInstance = axios.create({ timeout: 600000 });

  useEffect(() => {
    if (!chat) {
      setMessages([]);
      return;
    }
    // axios.get(`http://34.236.217.66:30009/chats/${chat.chat_id}/messages`, {
      axiosInstance.get(`https://summarize-ai.com/api/chats/${chat.chat_id}/messages`, {
      withCredentials: true,
    })
    .then(res => setMessages(res.data))
    .catch(err => console.error(err));
  }, [chat]);

  const handleSendMessage = async (text) => {
    if (!chat) return;

    const localUserMsg = {
      id: Date.now(),
      content: text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, localUserMsg]);
    const typingMsg = { id: 'typing', content: 'Assistant is typing...', sender: 'assistant' };
    setMessages((prev) => [...prev, typingMsg]);
    try 
      {
        const userMsg = await axiosInstance.post(`https://summarize-ai.com/api/chats/${chat.chat_id}/messages`,
          { userText: text }, 
          { withCredentials: true }
        );
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== 'typing').concat(userMsg.data.assistantMsg)
        );
      }      
    catch (err) 
      {
        console.error(err);
        setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));
      }
  };
  if (!chat) {
    return <div className="no-chat-message">Create or select an existing chat to get started</div>;
  }

  return (
    <div className="chat-window">
      <h2>{chat.title || `Chat #${chat.chat_id}`}</h2>
      <div className="chat-messages">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`message ${msg.sender === 'assistant' ? 'assistant-message' : 'user-message'}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;