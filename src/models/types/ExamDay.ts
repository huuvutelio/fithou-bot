import { Document } from 'mongoose';

import { ExamType } from 'types';

export default interface ExamDayType extends Document {
  username: string;
  dataSent: ExamType[];
}
