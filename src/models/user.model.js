import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensure emails are unique
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    profileImage: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
      }
    ],
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
      },
    ],
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    verificationCode: {
      type: Number,
    },
    verificationCodeExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lesson"
      }
    ]
  },
  { timestamps: true }
);

const userModel = mongoose.model('user', userSchema);

export default userModel;
