import logger from 'logger';
import { sendMessage } from 'services/facebook';
import { UserModel } from 'models';
import { ExamDay } from 'services/ctms/examDay';
import User from 'models/types/User';
import { ExamDayResponse, ExamType } from 'types';
import ExamDayModel from 'models/schemas/ExamDay';
import { calculateTheNumberOfDaysBetweenTwoDates, convertDate } from 'utils/constants';

const message = (text: string, examDay: ExamType) => {
  return `${text}:
-----------------
STT: ${examDay?.OrdinalNumbers}
Thời gian: ${examDay?.ExamTime}
Phòng thi: ${examDay?.ExamRoom}
Môn thi: ${examDay?.ExamSubject}
Mã DS thi: ${examDay?.CodeOfExamList}`;
};

export const examDaySchedule = async () => {
  try {
    const users: User[] = await UserModel.find({ isExamDay: true });
    const today = new Date();

    for (const user of users) {
      const examDayResponse: ExamDayResponse = await ExamDay(user.username, user.password);

      if (examDayResponse?.isExpired) {
        await sendMessage(user?.subscribedID, {
          text: 'Tài khoản CTMS của bạn đã hết hạn, vui lòng gửi mail theo hướng dẫn để dùng tiếp dịch vụ nha!🥲',
        });
      }

      const examDayData = await ExamDayModel.findOne({ username: user.username });

      if (!examDayData) {
        await ExamDayModel.create({ username: user.username, dataSent: examDayResponse?.data });
        for (let i = 0; i < examDayResponse?.data?.length; i++) {
          await sendMessage(user?.subscribedID, {
            text: message('Bạn có lịch thi 🥰', examDayResponse?.data[i]),
          });
        }

        continue;
      }

      for (let i = 0; i < examDayResponse?.data?.length; i++) {
        const foundMissing = examDayData.dataSent.find(
          (item) => item.ExamSubject === examDayResponse?.data[i].ExamSubject
        );
        if (!foundMissing) {
          await sendMessage(user?.subscribedID, {
            text: message('Bạn có lịch thi 🥰', examDayResponse?.data[i]),
          });
        }

        const hasChanged = examDayData.dataSent.find(
          (item) =>
            item.ExamSubject === examDayResponse?.data[i].ExamSubject &&
            item.ExamTime !== examDayResponse?.data[i].ExamTime
        );
        if (hasChanged) {
          await sendMessage(user?.subscribedID, {
            text: message('Lịch thi của bạn đã thay đổi 😎', examDayResponse?.data[i]),
          });
        }

        const hasChangedRoom = examDayData.dataSent.find(
          (item) =>
            item.ExamSubject === examDayResponse?.data[i].ExamSubject &&
            item.ExamRoom !== examDayResponse?.data[i].ExamRoom
        );
        if (hasChangedRoom) {
          await sendMessage(user?.subscribedID, {
            text: message('Phòng thi của bạn đã thay đổi 😜', examDayResponse?.data[i]),
          });
        }

        const dateOfExam = new Date(convertDate(examDayResponse?.data[i]?.ExamTime.split(' ')[1]));

        const numberOfDate = calculateTheNumberOfDaysBetweenTwoDates(dateOfExam, today);

        if (numberOfDate === 1) {
          await sendMessage(user?.subscribedID, {
            text: message('Bạn có lịch thi ngày mai 😝', examDayResponse?.data[i]),
          });
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
};
