import { useState } from "react";
import axios from "axios";
import "./chatbot.css"; // Import the external CSS file


const Chatbot = () => {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(""); 
  const [loading, setLoading] = useState(false);
  // require('dotenv').config({ path: '.../.env' });
  const API_KEy = process.env.REACT_APP_API_KEY;
  console.log(API_KEy);

  // const API_KEY = "AIzaSyAxgGebUpATuwLV7tqVkSEtMtOb8vxTElw"; // Replace with actual API key
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
  
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEy}`,
        {
          contents: [
            { role: "user", parts: [{ text: messages.map(m => m.text).join("\n") + "\n" + input }] }
          ]
        }
      );
  
      const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "I couldn't understand that.";
  
      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { text: "Error: Unable to fetch response.", sender: "bot" }]);
    }
  
    setLoading(false);
  };
  
  return (
    <div className="bbb_body">
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="bot-message">Typing...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button" disabled={loading}>
          Send
        </button>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
