import mongoose from 'mongoose';

const quizSchema = mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'lesson',
      required: true,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [String],
        correctOption: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const quizModel = mongoose.model('quiz', quizSchema);

export default quizModel;
