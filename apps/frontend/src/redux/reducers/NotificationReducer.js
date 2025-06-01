import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allNotifications: [],
};

export const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setAllNotifications: function (state, action) {
      state.allNotifications = action.payload;
    },
  },
});

export default NotificationSlice.reducer;

export const { setAllNotifications } = NotificationSlice.actions;
