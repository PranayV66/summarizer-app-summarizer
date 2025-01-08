import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageInput from './MessageInput';

function ChatWindow({ chat, token }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chat) return;
    // fetch messages for this chat

    axios.get(`http://3.209.77.92:9000/chats/${chat.chat_id}/messages`, {
      withCredentials: true,
    })
    .then(res => setMessages(res.data))
    .catch(err => console.error(err));
  }, [chat, token]);

  const handleSendMessage = (text) => {
    if (!chat) return;
    // send message to this chat
    
    axios.post(`http://3.209.77.92:9000/chats/${chat.chat_id}/messages`,
      { userText: text, 
      withCredentials: true,
    })
    .then(res => {
      // res.data => { userMsg, assistantMsg }
      setMessages(prev => [...prev, res.data.userMsg, res.data.assistantMsg]);
    })
    .catch(err => console.error(err));
  };

  if (!chat) {
    return <div style={{ flex: 1, padding: '16px' }}>Select a chat</div>;
  }

  return (
    <div style={{ flex: 1, padding: '16px' }}>
      <h2>{chat.title || `Chat #${chat.chat_id}`}</h2>
      <div style={{ border: '1px solid #ddd', padding: '8px', height: '60vh', overflowY: 'auto' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: '8px' }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;