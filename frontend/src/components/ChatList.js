import React from 'react';
import '../ChatList.css';

function ChatList({ chats, onSelectChat }) {
  return (
    <div className="chat-list">
      <h3>My Chats</h3>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chat-list-item"
          onClick={() => onSelectChat(chat)}
        >
          {chat.title}
        </div>
      ))}
    </div>
  );
}

export default ChatList;