import Message from '../models/chatModel.js';
import ErrorHandler from '../utils/error.js';

export const sendMessage = async (data) => {
  try {
    const newMessage = new Message({
      sender: data.sender,
      receiver: data.receiver,
      message: data.message
    });
    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.error(error);
    throw new ErrorHandler(500, 'Internal server error');
  }
};
