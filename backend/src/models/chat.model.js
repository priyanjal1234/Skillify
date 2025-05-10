// chat.model.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const chatModel = mongoose.model('chat', chatSchema);
export default chatModel;
