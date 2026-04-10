import { useState } from "react";
import { sendMessage } from "../api/messages";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const res = await sendMessage(1, message);

    setMessages([...messages, res.message]);  // 👈 add to UI
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat</h2>

      {/* Show messages */}
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <b>{msg.role}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
}