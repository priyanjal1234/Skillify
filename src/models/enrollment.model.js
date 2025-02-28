import mongoose from 'mongoose';

const enrollmentSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'course',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson',
      },
    ],
  },
  { timestamps: true }
);

const enrollmentModel = mongoose.model('enrollment', enrollmentSchema);

export default enrollmentModel;
