import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
    },
    content: {
      type: String,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'course',
      required: true,
    },
  },
  { timestamps: true }
);

const lessonModel = mongoose.model('lesson', lessonSchema);

export default lessonModel