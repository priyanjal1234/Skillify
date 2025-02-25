import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCourses: [],
  instructorCourses: [],
};

export const CourseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setInstructorCourses: function (state, action) {
      state.instructorCourses = action.payload;
    },
    setAllCourses: function(state,action) {
      state.allCourses = action.payload
    }
  },
});

export default CourseSlice.reducer;

export const { setInstructorCourses,setAllCourses } = CourseSlice.actions;
