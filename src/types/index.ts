export interface ExamType {
  OrdinalNumbers: string;
  ExamTime: string;
  ExamRoom: string;
  ExamSubject: string;
  CodeOfExamList: string;
}

export interface ExamDayResponse {
  data?: ExamType[];
  isExpired?: boolean;
}
