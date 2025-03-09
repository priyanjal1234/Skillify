import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket, { connectSocket } from "../socket/socket.js";
import { useQuery } from "@tanstack/react-query";
import chatService from "../services/Chat.js";
import {
  setReceiverChats,
  setSenderChats,
} from "../redux/reducers/ChatReducer.js";

const InstructorMessages = () => {
  const { enrolledStudents } = useSelector((state) => state.enrollment);
  const { currentUser } = useSelector((state) => state.user);
  const { senderChats, receiverChats } = useSelector((state) => state.chat);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState(null);
  const dispatch = useDispatch();

  console.log(enrolledStudents);

  useEffect(() => {
    connectSocket();

    socket.on("room-joined", (room) => {
      setRoom(room);
    });

    socket.on("error", (errorMessage) => {
      console.log(errorMessage);
    });
  }, []);

  let { refetch: refetchSenderChats } = useQuery({
    queryKey: ["fetchSenderChats", selectedStudent?._id],
    enabled: !!selectedStudent,
    queryFn: async function () {
      try {
        let res = await chatService.getSenderChats(
          currentUser?._id,
          selectedStudent?._id
        );
        console.log("Sender Chats:", res);
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

  let { refetch: refetchReceiverChats } = useQuery({
    queryKey: ["fetchReceiverChats", selectedStudent?._id],
    enabled: !!selectedStudent,
    queryFn: async function () {
      try {
        let res = await chatService.getReceiverChats(selectedStudent?._id);
        console.log("Receiver Chats:", res);
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

  useEffect(() => {
    function handleNewMsg(newMsg) {
      console.log("New message received:", newMsg);

      refetchSenderChats();
      refetchReceiverChats();
    }

    socket.on("new-message", handleNewMsg);
  },[refetchReceiverChats,refetchSenderChats]);

  function handleSelectStudent(student) {
    if (student && student._id) {
      setSelectedStudent(student);
      socket.emit("join-room", student._id);
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
          sender: conversation.sender, // Attach the conversation's sender
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
    <div className="flex flex-col min-h-screen bg-[#121826] text-white">
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

        {selectedStudent !== null && (
          <div className="flex-1 flex flex-col bg-[#0e1118]">
            <div className="p-4 border-b border-[#2f3342]">
              <h2 className="text-lg">
                {selectedStudent?.name || "Select a Chat"}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col">
              {allMessages.length > 0 ? (
                allMessages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`max-w-[60%] mb-4 p-3 rounded-md ${
                      msg.sender === currentUser._id
                        ? "bg-[#48506b] self-end"
                        : "bg-[#2f3342] self-start"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="block mt-1 text-xs opacity-70 text-right">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No Messages Yet</p>
              )}
            </div>
            {/* Input area fixed at bottom using flex-shrink-0 */}
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
