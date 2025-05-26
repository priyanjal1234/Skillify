import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoggedin: false,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedin: function (state, action) {
      state.isLoggedin = action.payload;
    },
    setCurrentUser: function (state, action) {
      state.currentUser = action.payload;
      //   if(action.payload) {
      //     setCurrentUser(action.payload)
      //     setLoggedin(true)
      //   }
      //   else {
      //     setLoggedin(false)
      //   }
    },
  },
});

export default UserSlice.reducer;

export const { setLoggedin, setCurrentUser } = UserSlice.actions;
