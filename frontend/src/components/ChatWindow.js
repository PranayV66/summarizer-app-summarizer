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

  const handleSendMessage = async (text) => {
    if (!chat) return;
    // send message to this chat
    try 
      {
        const userMsg = await axios.post(`http://3.209.77.92:9000/chats/${chat.chat_id}/messages`,
          { userText: text }, 
          { withCredentials: true }
        );
        const typingMsg = { id: 'typing', content: 'Assistant is typing...' };
          setMessages(prev => [...prev, userMsg.data.userMsg, typingMsg]);

        const assistantMsg = userMsg.data.assistantMsg;
        setMessages(prev => prev.filter(msg => msg.id !== 'typing').concat(assistantMsg));
      }      
    catch (err) 
      {
        console.error(err);
        // Remove "Assistant is typing..." if an error occurs
        setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      }
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
            <div>{msg.content}</div>
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;