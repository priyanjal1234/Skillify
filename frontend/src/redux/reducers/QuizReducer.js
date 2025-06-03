import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentQuiz: {},
};

export const QuizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setCurrentQuiz: function (state, action) {
      state.currentQuiz = action.payload;
    },
  },
});

export default QuizSlice.reducer;

export const { setCurrentQuiz } = QuizSlice.actions;
