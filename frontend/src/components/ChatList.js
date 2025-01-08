import React from 'react';

function ChatList({ chats, onSelectChat }) {
  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc' }}>
      <h3>My Chats</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {chats.map(chat => (
          <li
            key={chat.chat_id}
            style={{ cursor: 'pointer', marginBottom: '8px' }}
            onClick={() => onSelectChat(chat)}
          >
            {chat.title || `Chat #${chat.chat_id}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;