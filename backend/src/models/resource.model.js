import mongoose from 'mongoose';

const resourceSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['pdf', 'link', 'video'],
      required: [true, 'Resource type is required'],
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
    },
  },
  { timestamps: true }
);

const resourceModel = mongoose.model("resource",resourceSchema)

export default resourceModel
