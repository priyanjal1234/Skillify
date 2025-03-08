import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  senderChats: [],
  receiverChats: [],
};

export const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSenderChats: function (state, action) {
      state.senderChats = action.payload;
    },
    setReceiverChats: function (state, action) {
      state.receiverChats = action.payload;
    },
  },
});

export default ChatSlice.reducer;

export const { setSenderChats, setReceiverChats } = ChatSlice.actions;
