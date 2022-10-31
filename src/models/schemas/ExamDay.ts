import { model, Model, Schema } from 'mongoose';

import { MODELS } from 'utils/constants/models';
import ExamDay from '../types/ExamDay';

const ExamDaySchema = new Schema<ExamDay>(
  {
    username: { type: String, required: true },
    dataSent: [
      {
        OrdinalNumbers: { type: String, required: true },
        ExamTime: { type: String, required: true },
        ExamRoom: { type: String, required: true },
        ExamSubject: { type: String, required: true },
        CodeOfExamList: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

ExamDaySchema.index({ username: 1 });

const ExamDayModel: Model<ExamDay> = model<ExamDay>(MODELS.examDay, ExamDaySchema, MODELS.examDay);
export default ExamDayModel;
