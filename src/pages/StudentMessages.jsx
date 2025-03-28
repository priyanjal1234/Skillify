import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket, { connectSocket } from "../socket/socket.js";
import { useQuery } from "@tanstack/react-query";
import chatService from "../services/Chat.js";
import {
  setReceiverChats,
  setSenderChats,
} from "../redux/reducers/ChatReducer.js";
import userService from "../services/User.js";
import { Menu } from "lucide-react";

const StudentMessages = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { senderChats, receiverChats } = useSelector((state) => state.chat);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    connectSocket();

    socket.on("room-joined", (room) => setRoom(room));
    socket.on("error", (errorMessage) => console.log(errorMessage));
  }, []);

  const { refetch: refetchReceiverChats } = useQuery({
    queryKey: ["fetchReceiverChats", selectedInstructor?._id],
    enabled: !!selectedInstructor,
    queryFn: async function () {
      try {
        let res = await chatService.getReceiverChats(selectedInstructor?._id);
        if (res.status === 200) {
          dispatch(setReceiverChats(res.data));
        }
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return false;
      }
    },
  });

  const { refetch: refetchSenderChats } = useQuery({
    queryKey: ["fetchSenderChats", selectedInstructor?._id],
    enabled: !!selectedInstructor,
    queryFn: async function () {
      try {
        let res = await chatService.getSenderChats(
          currentUser?._id,
          selectedInstructor._id
        );
        if (res.status === 200) {
          dispatch(setSenderChats(res.data));
        }
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return false;
      }
    },
  });

  useEffect(() => {
    function handleNewMessage(newMsg) {
      refetchReceiverChats();
      refetchSenderChats();
    }

    socket.on("new-message", handleNewMessage);
  }, [refetchReceiverChats, refetchSenderChats]);

  const { data: courseInstructors } = useQuery({
    queryKey: ["fetchCourseInstructors"],
    queryFn: async function () {
      try {
        let res = await userService.getCourseInstructors();
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return false;
      }
    },
  });

  function handleSelectInstructor(instructor) {
    if (instructor && instructor._id) {
      setSelectedInstructor(instructor);
      socket.emit("join-room", instructor._id);

      refetchReceiverChats();
      refetchSenderChats();
      setMenuOpen(false);
    }
  }

  function handleSendMessage(senderId, receiverId) {
    if (message && room) {
      socket.emit("send-message", { room, senderId, receiverId, message });

      setMessage("");
      refetchSenderChats();
    }
  }

  const flattenMessages = (chatsArray) => {
    if (!chatsArray) return [];
    return chatsArray.reduce((acc, conversation) => {
      if (conversation.messages && conversation.messages.length > 0) {
        const msgs = conversation.messages.map((m) => ({
          ...m,
          sender: conversation.sender,
          createdAt: m.createdAt || conversation.createdAt,
        }));
        return [...acc, ...msgs];
      }
      return acc;
    }, []);
  };

  const allChats = [
    ...flattenMessages(senderChats),
    ...flattenMessages(receiverChats),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="flex flex-col h-screen bg-[#121826] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-[#1d2231] px-4 py-3 sm:px-6">
        <div className="text-xl font-bold">Skillify</div>
        {/* Hamburger Menu for Mobile */}
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={24} />
        </button>
      </nav>

      {/* Main Chat Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`absolute sm:relative sm:w-1/4 bg-[#1d2231] border-r border-[#2f3342] flex flex-col transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 w-2/3 sm:w-1/4 z-10`}
        >
          <div className="p-4 border-b border-[#2f3342]">
            <h2 className="text-lg">Chats</h2>
          </div>
          <ul className="flex-grow overflow-y-auto">
            {courseInstructors?.length > 0 ? (
              courseInstructors?.map((instructor) => (
                <li
                  onClick={() => handleSelectInstructor(instructor)}
                  key={instructor?._id}
                  className={`p-4 border-b ${
                    instructor?._id === selectedInstructor?._id
                      ? "bg-[#2f3342]"
                      : "hover:bg-[#2f3342]"
                  } border-[#2f3342] cursor-pointer`}
                >
                  <div className="font-bold mb-1">{instructor?.name}</div>
                </li>
              ))
            ) : (
              <p className="p-4">No Course Instructors</p>
            )}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#0e1118]">
          <div className="p-4 border-b border-[#2f3342]">
            <h2 className="text-lg">{selectedInstructor?.name || "Select a Chat"}</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col">
            {allChats.length > 0 ? (
              allChats.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`max-w-[80%] sm:max-w-[60%] p-3 rounded-md ${
                    msg.sender === currentUser._id ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="block mt-1 text-xs opacity-70">
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

          {/* Input */}
          <div className="p-4 bg-[#1d2231] flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 rounded bg-[#2f3342] text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={() => handleSendMessage(currentUser?._id, selectedInstructor?._id)}
              className="ml-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;
