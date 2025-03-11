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
import { Trash2 } from "lucide-react";

const StudentMessages = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  // We'll now use both senderChats and receiverChats from Redux.
  const { senderChats, receiverChats } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState(null);

  const [deletedMessageIds, setDeletedMessageIds] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    connectSocket();

    socket.on("room-joined", (room) => {
      setRoom(room);
    });

    socket.on("error", (errorMessage) => {
      console.log(errorMessage);
    });
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
    } else {
      console.error("Invalid instructor object:", instructor);
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

  const flattenedSenderMessages = flattenMessages(senderChats);
  const flattenedReceiverMessages = flattenMessages(receiverChats);

  const allChats = [...flattenedSenderMessages, ...flattenedReceiverMessages];

  allChats.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const visibleChats = allChats.filter(
    (msg) => !deletedMessageIds.includes(msg._id)
  );

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
            {courseInstructors?.length > 0 ? (
              courseInstructors?.map((instructor) => (
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
              ))
            ) : (
              <p className="p-4">No Course Instructors</p>
            )}
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
              {visibleChats.length > 0 ? (
                visibleChats.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`max-w-[60%] flex items-center mb-4 p-3 rounded-md ${
                      // Outgoing messages (sent by the student) align right;
                      // incoming messages (sent by the instructor) align left.
                      msg.sender === currentUser._id
                        ? "bg-[#47538c] self-end"
                        : "bg-[#2f3342] self-start"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p>{msg.content}</p>
                        <span className="block mt-1 text-xs opacity-70 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No Messages Yet</p>
              )}
            </div>

            <div className="sticky bottom-0 p-4 bg-[#1d2231]">
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
