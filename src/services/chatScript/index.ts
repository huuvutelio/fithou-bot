import { examDay, removeCtmsAccount, sendLoginCtmsButton, sendMessage, unExamDay } from 'services/facebook';
import { define } from './define';

export const chatScript = async (id: string, message: string) => {
  switch (message) {
    case define.login:
      sendLoginCtmsButton(id);
      return;
    case define.logout:
      removeCtmsAccount(id);
      return;
    case define.help:
      sendMessage(id, {
        text: `Từ từ đoạn này chưa code nha :D`,
      });
      return;
    case define.examday:
      examDay(id);
      return;
    case define.un_examday:
      unExamDay(id);
      return;
    default:
      sendMessage(id, {
        text: `Bot ngu ngok quá, không hiểu gì hết :(`,
      });
      return;
  }
};
