const MessageList = ({ messages }) => {
  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.sender}</strong>: {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
