import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket, { connectSocket } from "../socket/socket.js";
import { useQuery } from "@tanstack/react-query";
import chatService from "../services/Chat.js";
// Assume you have a Redux action to set the receiver chats
import { setReceiverChats } from "../redux/reducers/ChatReducer.js";
import userService from "../services/User.js";

const StudentMessages = () => {
  const { instructors } = useSelector((state) => state.enrollment);
  const { currentUser } = useSelector((state) => state.user);

  const { receiverChats } = useSelector((state) => state.chat);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState(null);
  const dispatch = useDispatch();

  const { refetch: refetchReceiverChats } = useQuery({
    queryKey: ["fetchReceiverChats", selectedInstructor?._id],
    enabled: !!selectedInstructor,
    queryFn: async function () {
      try {
        let fetchReceiverChatsRes = await chatService.getReceiverChats(
          currentUser?._id,
          selectedInstructor?._id
        );
        if (fetchReceiverChatsRes.status === 200) {
          dispatch(setReceiverChats(fetchReceiverChatsRes.data));
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

  let {data: courseInstructors} = useQuery({
    queryKey: ["fetchCourseInstructors"],
    queryFn: async function() {
        try {
            let getCourseInstructorsRes = await userService.getCourseInstructors()
            console.log(getCourseInstructorsRes)
            return getCourseInstructorsRes.data
        } catch (error) {
            console.log(error?.response?.data?.message)
            return false
        }
    }
  })

  function handleSelectInstructor(instructor) {
    if (instructor) {
      setSelectedInstructor(instructor);
      socket.emit("join-room", instructor?._id);
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
    setMessage("");
    refetchReceiverChats();
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
            {courseInstructors?.map((instructor) => (
              <li
                onClick={() => handleSelectInstructor(instructor)}
                key={instructor?._id}
                className={`p-4 border-b ${
                  instructor?._id === selectedInstructor?._id
                    ? "bg-[#2f3342]"
                    : "hover:bg-[#2f3342]"
                } border-[#2f3342] cursor-pointer transition-colors`}
              >
                <div className="font-bold mb-1">{instructor?.name}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: Conversation Area */}
        {selectedInstructor !== null && (
          <div className="flex-1 flex flex-col bg-[#0e1118]">
            <div className="p-4 border-b border-[#2f3342]">
              <h2 className="text-lg">
                {selectedInstructor?.name || "Select a Chat"}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col">
              {receiverChats && receiverChats?.length > 0 ? (
                receiverChats.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`max-w-[60%] mb-4 p-3 rounded-md ${
                      // Align messages from the instructor to the left and any student replies to the right.
                      msg.sender === selectedInstructor?._id
                        ? "bg-[#2f3342] self-start"
                        : "bg-[#48506b] self-end"
                    }`}
                  >
                    <p>{msg.message.content}</p>
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
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={() =>
                    handleSendMessage(currentUser?._id, selectedInstructor?._id)
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

export default StudentMessages;
