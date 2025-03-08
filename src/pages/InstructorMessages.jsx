import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import socket, { connectSocket, disconnectSocket } from "../socket/socket.js";

const InstructorMessages = () => {
  let { enrolledStudents } = useSelector((state) => state.enrollment);
  let { currentUser } = useSelector((state) => state.user);
  const [selectedStudent, setselectedStudent] = useState(null);
  const [message, setmessage] = useState("");
  const [room, setroom] = useState(null);

  useEffect(() => {
    connectSocket();

    socket.on("room-joined", function (room) {
      setroom(room);
    });

    socket.on("error", function (errorMessage) {
      console.log(errorMessage);
    });
  }, []);

  function handleSelectStudent(student) {
    if (student) {
      setselectedStudent(student);
      socket.emit("join-room", student?._id);
    }
  }

  function handleSendMessage(senderId, receiverId) {
    if (message && room) {
      socket.emit("send-message", {
        room,
        senderId,
        receiverId,
        message,
      });
    }

    setmessage("");
  }

  return (
    <div className="flex flex-col h-screen bg-[#121826] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-[#1d2231] px-4 py-2">
        <div className="text-xl font-bold">Skillify</div>
      </nav>

      {/* Main Chat Container */}
      <div className="flex flex-1">
        {/* Left Panel: Chat List */}
        <div className="w-1/4 bg-[#1d2231] border-r border-[#2f3342] flex flex-col">
          <div className="p-4 border-b border-[#2f3342]">
            <h2 className="text-lg">Chats</h2>
          </div>
          <ul className="flex-grow overflow-y-auto">
            {enrolledStudents?.map((student, index) => (
              <li
                onClick={() => handleSelectStudent(student?.student)}
                key={student?._id}
                className={`p-4 border-b ${
                  student?.student?._id === selectedStudent?._id
                    ? "bg-[#2f3342]"
                    : "hover:bg-[#2f3342]"
                }  border-[#2f3342] cursor-pointer transition-colors 
                  `}
              >
                <div className="font-bold mb-1">{student?.student?.name}</div>
                <div className="text-sm text-gray-300">
                  Last Message will appear here
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex flex-col bg-[#0e1118]">
          <div className="p-4 border-b border-[#2f3342]">
            <h2 className="text-lg">{selectedStudent?.name}</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {/* {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[60%] mb-4 p-3 rounded-md 
                  ${
                    msg.type === "sent"
                      ? "bg-[#48506b] self-end"
                      : "bg-[#2f3342] self-start"
                  }`}
              >
                <p>{msg.text}</p>
                <span className="block mt-1 text-xs opacity-70 text-right">
                  {msg.time}
                </span>
              </div>
            ))} */}
          </div>
          <div className="p-4">
            <div className="flex p-4 border-t border-[#2f3342] bg-[#1d2231]">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 mr-2 rounded bg-[#2f3342] text-white focus:outline-none"
                value={message}
                onChange={(e) => setmessage(e.target.value)}
              />
              <button
                onClick={() =>
                  handleSendMessage(currentUser?._id, selectedStudent?._id)
                }
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorMessages;
