import { model, Model, Schema } from 'mongoose';

import { MODELS } from 'utils/constants/models';
import ExamDayType from 'models/types/ExamDay';

const ExamDaySchema = new Schema<ExamDayType>(
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

const ExamDayModel: Model<ExamDayType> = model<ExamDayType>(MODELS.examDay, ExamDaySchema, MODELS.examDay);
export default ExamDayModel;
