import chatModel from '../models/chat.model.js';
import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const getSenderChats = async function (req, res, next) {
  try {
    let { senderId,receiverId } = req.params;
  
    let sender = await userModel.findOne({ _id: senderId });
    let receiver = await userModel.findOne({_id: receiverId})
    if (!sender) {
      return next(new ApiError(404, 'Sender with this id not found'));
    }
    if (!receiver) {
      return next(new ApiError(404, 'Receiver with this id not found'));
    }

    let senderChats = await chatModel.find({ sender: senderId,receiver: receiverId });
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

const getReceiverChats = async function (req, res, next) {
  try {
    let { receiverId } = req.params;
    let receiver = await userModel.findOne({ _id: receiverId });
    if (!receiver) {
      return next(new ApiError(404, 'Receiver not found with this id'));
    }

    let receiverChats = await chatModel.find({ receiver: receiverId });
    return res.status(200).json(receiverChats);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error getting receiver chats'
      )
    );
  }
};

export { getSenderChats, getReceiverChats };
