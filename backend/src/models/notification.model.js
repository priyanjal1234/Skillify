import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    type: {
      type: String,
      enum: ['quiz', 'course', 'announcement', 'message'],
    },
    message: {
      type: String,
      required: true,
    },
    readBy: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
  },
  { timestamps: true }
);

const notificationModel = mongoose.model('notification', notificationSchema);

export default notificationModel;
