import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket, { connectSocket } from "../socket/socket.js";
import { useQuery } from "@tanstack/react-query";
import chatService from "../services/Chat.js";
import { setSenderChats } from "../redux/reducers/ChatReducer.js";

const InstructorMessages = () => {
  const { enrolledStudents } = useSelector((state) => state.enrollment);
  const { currentUser } = useSelector((state) => state.user);
  const { senderChats } = useSelector((state) => state.chat);
  const [selectedStudent, setselectedStudent] = useState(null);
  const [message, setmessage] = useState("");
  const [room, setroom] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    connectSocket();

    socket.on("room-joined", function (room) {
      setroom(room);
    });

    socket.on("error", function (errorMessage) {
      console.log(errorMessage);
    });
  }, []);

  let { refetch: refetchSenderChats } = useQuery({
    queryKey: ["fetchSenderChats", selectedStudent?._id],
    enabled: !!selectedStudent, // only run when a student is selected
    queryFn: async function () {
      try {
        let fetchSenderChatsRes = await chatService.getSenderChats(
          currentUser?._id,
          selectedStudent?._id
        );
        console.log(fetchSenderChatsRes);
        if (fetchSenderChatsRes.status === 200) {
          dispatch(setSenderChats(fetchSenderChatsRes.data));
        }
        return true;
      } catch (error) {
        if (error?.response?.status === 404) {
          return;
        }
        return false;
      }
    },
  });

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
    refetchSenderChats();
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
            {enrolledStudents?.map((student) => (
              <li
                onClick={() => handleSelectStudent(student?.student)}
                key={student?._id}
                className={`p-4 border-b ${
                  student?.student?._id === selectedStudent?._id
                    ? "bg-[#2f3342]"
                    : "hover:bg-[#2f3342]"
                } border-[#2f3342] cursor-pointer transition-colors`}
              >
                <div className="font-bold mb-1">{student?.student?.name}</div>
                
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: Conversation Area */}
        {selectedStudent !== null && (
          <div className="flex-1 flex flex-col bg-[#0e1118]">
            <div className="p-4 border-b border-[#2f3342]">
              <h2 className="text-lg">
                {selectedStudent?.name || "Select a Chat"}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col">
              {senderChats && senderChats?.length > 0 ? (
                senderChats.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className="max-w-[60%] mb-4 p-3 rounded-md bg-[#48506b] self-end"
                  >
                    <p>{msg.message}</p>
                    <span className="block mt-1 text-xs opacity-70 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No Messages Yet</p>
              )}
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
        )}
      </div>
    </div>
  );
};

export default InstructorMessages;
