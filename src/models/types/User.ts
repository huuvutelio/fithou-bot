import { Document } from 'mongoose';

interface Subject {
  subjectCode: string;
  subjectName: string;
}
export default interface User extends Document {
  username: string;
  password: string;
  subscribedID: string;
  subjectHTML: string;
  isSubscribedSubject: boolean;
  isTrackTimetable: boolean;
  isExamDay: boolean;
  validSubjects: Subject[];
}
