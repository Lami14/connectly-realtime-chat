import { useState } from "react";

const MessageInput = ({ sendMessage }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
