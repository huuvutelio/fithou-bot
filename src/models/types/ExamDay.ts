import { Document } from 'mongoose';

import { ExamType } from 'types';

export default interface User extends Document {
  username: string;
  dataSent: ExamType[];
}
