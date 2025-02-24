import mongoose from 'mongoose';

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    category: {
      type: String,
      enum: ['Programming', 'Business', 'Design', 'Math', 'Science', 'Other'],
    },
    thumbnail: {
      type: String,
      default: 'default-course-thumbnail.jpg',
    },
    price: {
      type: Number,
      default: 0, // Free courses by default
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson',
      },
    ],
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    rating: {
      average: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const courseModel = mongoose.model('course', courseSchema);

export default courseModel;
