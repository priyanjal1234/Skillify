import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalCourses: [],
  totalStudents: 0,
  totalRevenue: 0,
};

export const InstructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    setTotalCourses: function (state, action) {
      state.totalCourses = action.payload;
    },
    setTotalStudents: function (state, action) {
      state.totalStudents = action.payload;
    },
    setTotalRevenue: function (state, action) {
      state.totalRevenue = action.payload;
    },
  },
});

export default InstructorSlice.reducer;

export const { setTotalCourses, setTotalStudents, setTotalRevenue } =
  InstructorSlice.actions;
