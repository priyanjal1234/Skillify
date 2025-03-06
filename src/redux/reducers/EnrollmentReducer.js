import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrolledStudents: [],
};

export const EnrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    setEnrolledStudents: function (state, action) {
      state.enrolledStudents = action.payload;
    },
  },
});

export default EnrollmentSlice.reducer;

export const { setEnrolledStudents } = EnrollmentSlice.actions;
