import React, { useContext, useEffect, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import socket from "../socket/socket";

const initialMessages = [
  { sender: "bot", text: "Hello, I'm Skillify Bot! How can I help you today?" },
  { sender: "user", text: "Can you tell me more about your courses?" },
  {
    sender: "bot",
    text: "We offer a wide variety of certified courses. What would you like to learn?",
  },
];

const Bot = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const [messages, setMessages] = useState(initialMessages);
  const [inputVal, setinputVal] = useState("");

  useEffect(() => {
    socket.on("bot-reply",function(msg) {
        setMessages(prev => [...prev,{sender: "bot",text: msg}])
    })
  },[])

  function handleSendMessage() {
    if(inputVal.trim() !== "") {
        setMessages(prev => [...prev,{sender: "user",text: inputVal}])
        socket.emit("student-message",inputVal)
        setinputVal('')
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-6 flex flex-col">
        <div
          className={`flex-grow overflow-y-auto p-4 rounded-md ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`mb-4 flex ${
                message.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs md:max-w-sm ${
                  message.sender === "bot"
                    ? darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-900"
                    : "bg-blue-600 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        
        <div className="mt-4 flex sticky bottom-0">
          <input
            type="text"
            className={`flex-grow px-4 py-2 rounded-l-md border focus:outline-none ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Type your message..."
            value={inputVal}
            onChange={(e) => setinputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSendMessage} className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bot;
