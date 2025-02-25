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
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoeC_2VgaUp-id_Sqlsf0lG1DfmABAF6aTBw&s',
    },
    price: {
      type: Number,
      default: 0, // Free courses by default
    },
    level: {
      type: String,
      enum: ["Beginner" || "beginner","Intermediate" || "intermediate","Advanced" || "advanced"]
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
    status: {
      type: String,
      enum: ["Published","Review","Draft"],
      default: "Draft"
    }
  },
  { timestamps: true }
);

const courseModel = mongoose.model('course', courseSchema);

export default courseModel;
