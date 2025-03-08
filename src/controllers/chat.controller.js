import mongoose from 'mongoose';
import chatModel from '../models/chat.model.js';
import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const getSenderChats = async function (req, res, next) {
  try {
    let { senderId, receiverId } = req.params;

    let sender = await userModel.findOne({ _id: senderId });
    let receiver = await userModel.findOne({ _id: receiverId });
    if (!sender) {
      return next(new ApiError(404, 'Sender with this id not found'));
    }
    if (!receiver) {
      return next(new ApiError(404, 'Receiver with this id not found'));
    }

    let senderChats = await chatModel.find({
      sender: senderId,
      receiver: receiverId,
    });
    return res.status(200).json(senderChats);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error getting sender chats'
      )
    );
  }
};

const getUnreadChats = async function (req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });

    let unreadChats = await chatModel.find({
      receiver: user._id,
      'message.isRead': false,
    });
    return res.status(200).json(unreadChats);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error getting receiver chats'
      )
    );
  }
};

const getReceiverChats = async function (req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let { instructor } = req.params;
    let receiverChats = await chatModel.find({
      sender: instructor,
      receiver: user._id,
    });

    return res.status(200).json(receiverChats);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error Fetching Receiver Chats'
      )
    );
  }
};

export { getSenderChats, getUnreadChats, getReceiverChats };
