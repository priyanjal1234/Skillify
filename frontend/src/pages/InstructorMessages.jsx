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

  // Connect to socket and set up listeners
  useEffect(() => {
    connectSocket();

    socket.on("room-joined", (joinedRoom) => {
      setRoom(joinedRoom);
    });

    socket.on("error", (errorMessage) => {
      console.log(errorMessage);
    });
  }, []);

  // Fetch unread messages (backend now returns an object with filteredMessages & chat)
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

  // Fetch receiver chats
  const { refetch: refetchReceiverChats } = useQuery({
    queryKey: ["fetchReceiverChats", selectedStudent?._id],
    enabled: !!selectedStudent,
    queryFn: async () => {
      try {
        const res = await chatService.getReceiverChats(selectedStudent?._id);
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

  // Listen for new messages and re-fetch chats accordingly
  useEffect(() => {
    function handleNewMsg(newMsg) {
      console.log("New message received:", newMsg);
      refetchSenderChats();
      refetchReceiverChats();
    }
    socket.on("new-message", handleNewMsg);
    // Cleanup if necessary:
    // return () => socket.off("new-message", handleNewMsg);
  }, [refetchReceiverChats, refetchSenderChats]);

  // Join a room for the selected student
  async function handleSelectStudent(student) {
    if (student && student._id) {
      setSelectedStudent(student);
      socket.emit("join-room", student._id);

      try {
        let readMessagesRes = await chatService.readChats(
          unreadMessages?.filteredMessages
        );
        
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

  // Send a message
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

  // Flatten the chats so each message has a direct senderId property
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

  // Combine and sort all messages by their timestamp
  const allMessages = [...outgoingMessages, ...incomingMessages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const getUnreadCountForStudent = (studentId) => {
    if (!unreadMessages) return 0;

    const unreadArray = Array.isArray(unreadMessages)
      ? unreadMessages
      : [unreadMessages];

    const chatItem = unreadArray.find(
      (item) =>
        item.chat &&
        item.chat.sender === studentId &&
        item.chat.receiver === currentUser?._id
    );
    return chatItem ? chatItem.filteredMessages.length : 0;
  };

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
            {enrolledStudents?.map((enrollment) => {
              const studentObj = enrollment?.student;
              
              const unreadCount = getUnreadCountForStudent(studentObj?._id);

              // Skip rendering if the student name matches currentUser name
              if (studentObj?.email === currentUser?.email) {
                return null;
              }

              return (
                <li
                  key={enrollment?._id}
                  onClick={() => handleSelectStudent(studentObj)}
                  className={`p-4 border-b flex items-center justify-between border-[#2f3342] cursor-pointer transition-colors ${
                    studentObj?._id === selectedStudent?._id
                      ? "bg-[#2f3342]"
                      : "hover:bg-[#2f3342]"
                  }`}
                >
                  <div className="font-bold mb-1">{studentObj?.name}</div>
                  {unreadCount > 0 && (
                    <span className="text-red-500 bg-white rounded-full px-2 py-1 text-sm">
                      {unreadCount}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Panel: Selected Chat */}
        {selectedStudent !== null && (
          <div className="flex-1 flex flex-col bg-[#0e1118]">
            {/* Header */}
            <div className="p-4 border-b border-[#2f3342]">
              <h2 className="text-lg">
                {selectedStudent?.name || "Select a Chat"}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col">
              {allMessages.length > 0 ? (
                allMessages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`max-w-[60%] mb-4 p-3 rounded-md ${
                      msg.senderId === currentUser?._id
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

            {/* Input area */}
            <div className="p-4 bg-[#1d2231] z-40">
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
