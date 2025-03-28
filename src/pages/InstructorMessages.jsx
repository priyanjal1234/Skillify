import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket, { connectSocket } from "../socket/socket.js";
import { useQuery } from "@tanstack/react-query";
import chatService from "../services/Chat.js";
import {
  setReceiverChats,
  setSenderChats,
} from "../redux/reducers/ChatReducer.js";
import { toast } from "react-toastify";

const InstructorMessages = () => {
  const { enrolledStudents } = useSelector((state) => state.enrollment);
  const { currentUser, isLoggedin } = useSelector((state) => state.user);
  const { senderChats, receiverChats } = useSelector((state) => state.chat);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    connectSocket();
    socket.on("room-joined", (joinedRoom) => setRoom(joinedRoom));
    socket.on("error", (errorMessage) => console.log(errorMessage));
  }, []);

  // Fetch unread messages
  const { data: unreadMessages } = useQuery({
    queryKey: ["fetchLoggedinUserUnreadChats"],
    queryFn: async () => {
      try {
        const res = await chatService.getUnreadChats();
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return null;
      }
    },
    enabled: isLoggedin,
  });

  // Fetch sender chats
  const { refetch: refetchSenderChats } = useQuery({
    queryKey: ["fetchSenderChats", selectedStudent?._id],
    enabled: !!selectedStudent,
    queryFn: async () => {
      try {
        const res = await chatService.getSenderChats(
          currentUser?._id,
          selectedStudent?._id
        );
        if (res.status === 200) dispatch(setSenderChats(res.data));
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return false;
      }
    },
  });

  // Fetch receiver chats
  const { refetch: refetchReceiverChats } = useQuery({
    queryKey: ["fetchReceiverChats", selectedStudent?._id],
    enabled: !!selectedStudent,
    queryFn: async () => {
      try {
        const res = await chatService.getReceiverChats(selectedStudent?._id);
        if (res.status === 200) dispatch(setReceiverChats(res.data));
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return false;
      }
    },
  });

  useEffect(() => {
    function handleNewMsg(newMsg) {
      refetchSenderChats();
      refetchReceiverChats();
    }
    socket.on("new-message", handleNewMsg);
  }, [refetchReceiverChats, refetchSenderChats]);

  async function handleSelectStudent(student) {
    if (student && student._id) {
      setSelectedStudent(student);
      socket.emit("join-room", student._id);

      try {
        let readMessagesRes = await chatService.readChats(
          unreadMessages?.filteredMessages
        );
        console.log(readMessagesRes);
      } catch (error) {
        if (
          error?.response?.data?.message ===
          "There are no unread messages available"
        ) {
          return;
        } else {
          toast.error(error?.response?.data?.message);
        }
      }
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

  const flattenChats = (chats) => {
    if (!chats || !Array.isArray(chats)) return [];
    return chats.reduce((acc, conversation) => {
      if (conversation.messages && Array.isArray(conversation.messages)) {
        const flattened = conversation.messages.map((msg) => ({
          ...msg,
          senderId:
            typeof conversation.sender === "object"
              ? conversation.sender?._id
              : conversation.sender,
          createdAt: msg.createdAt || conversation.createdAt,
        }));
        return acc.concat(flattened);
      }
      return acc;
    }, []);
  };

  const outgoingMessages = flattenChats(senderChats);
  const incomingMessages = flattenChats(receiverChats);
  const allMessages = [...outgoingMessages, ...incomingMessages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="flex flex-col h-screen bg-[#121826] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-[#1d2231] px-4 py-2">
        <div className="text-xl font-bold">Skillify</div>
      </nav>

      {/* Chat Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`w-full md:w-1/4 bg-[#1d2231] border-r border-[#2f3342] flex flex-col transition-transform ${
            selectedStudent ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-[#2f3342]">
            <h2 className="text-lg">Chats</h2>
          </div>
          <ul className="overflow-y-auto">
            {enrolledStudents?.map((enrollment) => (
              <li
                key={enrollment?._id}
                onClick={() => handleSelectStudent(enrollment.student)}
                className="p-4 border-b border-[#2f3342] cursor-pointer hover:bg-[#2f3342]"
              >
                {enrollment.student?.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        {selectedStudent && (
          <div className="flex-1 flex flex-col bg-[#0e1118]">
            {/* Header */}
            <div className="p-4 border-b border-[#2f3342] flex items-center">
              <button
                className="md:hidden bg-[#2f3342] px-2 py-1 rounded mr-2"
                onClick={() => setSelectedStudent(null)}
              >
                Back
              </button>
              <h2 className="text-lg">{selectedStudent?.name}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {allMessages.length > 0 ? (
                allMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[80%] p-3 my-2 rounded-md ${
                      msg.senderId === currentUser?._id
                        ? "bg-[#48506b] self-end"
                        : "bg-[#2f3342] self-start"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No messages yet</p>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#2f3342]">
              <input
                type="text"
                className="w-full p-2 rounded bg-[#2f3342]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                onClick={() =>
                  handleSendMessage(currentUser?._id, selectedStudent?._id)
                }
                className="mt-2 bg-blue-600 px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorMessages;
