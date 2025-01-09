import React, { useState } from 'react';
import '../MessageInput.css';

function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '8px' }}>
      <textarea
        ref={textareaRef}
        className="message-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        rows={1}
      />
      <button type="submit" className="send-button">
        Send
      </button>
    </form>
  );
}

export default MessageInput;