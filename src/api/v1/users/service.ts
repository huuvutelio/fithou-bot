import { NextFunction, Request } from 'express';
import { UserModel } from 'models';
import { sendMessage } from 'services/facebook';

export const getAllUsers = async (req: Request, next: NextFunction) => {
  try {
    const result = await UserModel.find().select('-password -subjectHTML');

    return result;
  } catch (error) {
    next(error);
  }
};

export const sendNotiToUser = async (req: Request, next: NextFunction) => {
  try {
    const { message, id } = req.body;
    await sendMessage(id, {
      text: `${message}`,
    });
    return message;
  } catch (error) {
    next(error);
  }
};
