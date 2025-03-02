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
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
    },
    price: {
      type: Number,
      default: 0, // Free courses by default
    },
    level: {
      type: String,
      enum: [
        'Beginner' || 'beginner',
        'Intermediate' || 'intermediate',
        'Advanced' || 'advanced',
      ],
    },
    courseOutcome: {
      type: Array,
      default: [],
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
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        value: { type: Number, default: 0, min: 1, max: 5 },
      },
    ],
    status: {
      type: String,
      enum: ['Published', 'Review', 'Draft'],
      default: 'Draft',
    },
  },
  { timestamps: true }
);

const courseModel = mongoose.model('course', courseSchema);

export default courseModel;
