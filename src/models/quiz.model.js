import mongoose from 'mongoose';

const quizSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Quiz question is required'],
    },
    options: {
      type: [String],
      required: [true, 'Quiz options are required'],
    },
    correctOption: {
      type: Number,
      required: [true, 'Correct option index is required'],
    },
  },
  { timestamps: true }
);

const quizModel = mongoose.model("quiz",quizSchema)

export default quizModel