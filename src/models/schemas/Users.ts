import { model, Model, Schema } from 'mongoose';

import { MODELS } from 'utils/constants/models';
import User from '../types/User';

const UsersSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    subscribedID: { type: String, default: '' },
    subjectHTML: { type: String, default: '' },
    isSubscribedSubject: { type: Boolean, default: false },
    isTrackTimetable: { type: Boolean, default: false },
    isExamDay: { type: Boolean, default: false },
    validSubjects: {
      type: [{ subjectCode: String, subjectName: String }],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

UsersSchema.index({ subscribedID: 1, username: 1 });

const UsersModel: Model<User> = model<User>(MODELS.users, UsersSchema, MODELS.users);
export default UsersModel;
