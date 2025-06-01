import mongoose from 'mongoose';

const activitySchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const activityModel = mongoose.model("activity",activitySchema)

export default activityModel
