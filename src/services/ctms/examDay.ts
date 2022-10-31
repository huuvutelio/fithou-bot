import axios from 'axios';
import * as cheerio from 'cheerio';

import logger from 'logger';
import { convertDate, EXAM_DAY_URL, EXPIRED_CTMS } from 'utils/constants';
import { loginCtms, logoutCtms } from 'services/ctms/auth';
import { ExamDayResponse, ExamType } from 'types';
import { sendMessage } from 'services/facebook';
import ExamDayModel from 'models/schemas/ExamDay';

const message = (text: string, examDay: ExamType) => {
  return `${text}:
-----------------
STT: ${examDay?.OrdinalNumbers}
Thời gian: ${examDay?.ExamTime}
Phòng thi: ${examDay?.ExamRoom}
Môn thi: ${examDay?.ExamSubject}
Mã DS thi: ${examDay?.CodeOfExamList}`;
};

export const ExamDay = async (username: string, password: string, id?: string) => {
  try {
    const login = await loginCtms(username, password);
    const cookie = login.cookie.join('; ');

    if (login.isSuccess) {
      const dom = await axios.get(EXAM_DAY_URL, {
        headers: {
          Cookie: cookie,
        },
      });

      const $ = cheerio.load(dom.data);

      const expiredNotiText = $('#leftcontent #thongbao').text().trim();
      if (expiredNotiText === EXPIRED_CTMS) {
        const result: ExamDayResponse = {
          isExpired: true,
        };
        return result;
      }

      const data: string[] = [];
      const result: ExamType[] = [];

      $('.RowEffect tbody tr td').each(function (index, element) {
        const item = $(element).text().trim();
        data.push(item);
      });

      for (let i = 1; i < data.length / 5; i++) {
        const ordinalNumbers: string = data[i * 5];
        const examTime: string = data[i * 5 + 1];
        const examRoom: string = data[i * 5 + 2];
        const examSubject: string = data[i * 5 + 3];
        const codeOfExamList: string = data[i * 5 + 4];
        result.push({
          OrdinalNumbers: ordinalNumbers,
          ExamTime: examTime,
          ExamRoom: examRoom,
          ExamSubject: examSubject,
          CodeOfExamList: codeOfExamList,
        });
      }

      logoutCtms(login.cookie);

      const res: ExamDayResponse = {
        data: result,
      };

      if (res.isExpired) {
        await sendMessage(id, {
          text: 'Tài khoản CTMS của bạn đã hết hạn, vui lòng gửi mail theo hướng dẫn để dùng tiếp dịch vụ nha!🥲',
        });
      }

      const today = new Date('12/12/2022').getDate();
      const examDayData = await ExamDayModel.findOne({ username: username });

      if (!examDayData) {
        await ExamDayModel.create({ username: username, dataSent: res?.data });
        for (let i = 0; i < res?.data?.length; i++) {
          await sendMessage(id, {
            text: message('Bạn có lịch thi 🥰', res?.data[i]),
          });
        }

        return res;
      }

      for (let i = 0; i < res?.data?.length; i++) {
        const foundMissing = examDayData.dataSent.find((item) => item.ExamSubject === res?.data[i].ExamSubject);
        if (!foundMissing) {
          await sendMessage(id, {
            text: message('Bạn có lịch thi 🥰', res?.data[i]),
          });
        }

        const hasChanged = examDayData.dataSent.find(
          (item) => item.ExamSubject === res?.data[i].ExamSubject && item.ExamTime !== res?.data[i].ExamTime
        );
        if (hasChanged) {
          await sendMessage(id, {
            text: message('Lịch thi của bạn đã thay đổi 😎', res?.data[i]),
          });
        }

        const hasChangedRoom = examDayData.dataSent.find(
          (item) => item.ExamSubject === res?.data[i].ExamSubject && item.ExamRoom !== res?.data[i].ExamRoom
        );
        if (hasChangedRoom) {
          await sendMessage(id, {
            text: message('Phòng thi của bạn đã thay đổi 😜', res?.data[i]),
          });
        }

        const dateOfExam = new Date(convertDate(res?.data[i]?.ExamTime.split(' ')[1])).getDate();

        if (dateOfExam - today === 1) {
          await sendMessage(id, {
            text: message('Bạn có lịch thi ngày mai 😝', res?.data[i]),
          });
        }
      }

      return res;
    }
  } catch (error) {
    logger.error(`[ExamDay] ${error}`);
  }
};
