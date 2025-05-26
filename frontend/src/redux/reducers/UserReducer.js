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
        console.log("from user reducer")
        console.log(initialState.currentUser)
      if(initialState.currentUser) {
        setLoggedin(true)
      }
      else {
        setLoggedin(false)
      }
    },
    setCurrentUser: function (state, action) {
      if(action.payload) {
        setCurrentUser(action.payload)
        setLoggedin(true)
      }
      else {
        setLoggedin(false)
      }
    },
  },
});

export default UserSlice.reducer;

export const { setLoggedin, setCurrentUser } = UserSlice.actions;
