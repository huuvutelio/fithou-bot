/* eslint-disable max-len */
import { chatScript } from 'services/chatScript';
import {
  sendLoginCtmsButton,
  sendMessage,
  subCtmsSubject,
  subscribedFithouNotification,
  unsubCtmsSubject,
  unsubFithouNotification,
  unTrackTimetable,
  trackTimetable,
  removeCtmsAccount,
  sendQuickReplies,
} from 'services/facebook';
import { NOTI_IMAGE } from 'utils/constants';

const handleWebhook = async (data: any) => {
  const messaging = data.entry[0].messaging;
  for (let i = 0; i < messaging.length; i++) {
    const { sender, postback, message } = messaging[i];

    const { id } = sender;
    if (postback) {
      const { payload } = postback;
      switch (payload) {
        case 'GET_STARTED':
          await sendMessage(id, {
            text: `Chào mừng bạn đến với Fithou BOT. Chúc bạn có một trải nghiệm zui zẻ :D. #help để biết thêm chi tiết!`,
          });
          return;
        case 'CTMS_SERVICE':
          sendQuickReplies(id, 'Chọn một câu trả lời:', [
            {
              content_type: 'text',
              title: 'Thêm CTMS',
              payload: 'ADD_CTMS_ACCOUNT',
              image_url: NOTI_IMAGE.on,
            },
            {
              content_type: 'text',
              title: 'Xóa CTMS',
              payload: 'REMOVE_CTMS_ACCOUNT',
              image_url: NOTI_IMAGE.off,
            },
          ]);
          return;
        case 'FITHOU_CRAWL_SERVICE':
          sendQuickReplies(id, 'Chọn một câu trả lời:', [
            {
              content_type: 'text',
              title: 'Bật thông báo',
              payload: 'ADD_FITHOU_CRAWL_SERVICE',
              image_url: NOTI_IMAGE.on,
            },
            {
              content_type: 'text',
              title: 'Tắt thông báo',
              payload: 'REMOVE_FITHOU_CRAWL_SERVICE',
              image_url: NOTI_IMAGE.off,
            },
          ]);
          return;
        case 'CTMS_CREDITS_SERVICE':
          sendQuickReplies(id, 'Chọn một câu trả lời:', [
            {
              content_type: 'text',
              title: 'Bật theo dõi',
              payload: 'ADD_CTMS_CREDITS_SERVICE',
              image_url: NOTI_IMAGE.on,
            },
            {
              content_type: 'text',
              title: 'Tắt theo dõi',
              payload: 'REMOVE_CTMS_CREDITS_SERVICE',
              image_url: NOTI_IMAGE.off,
            },
          ]);
          return;
        case 'CTMS_TIMETABLE_SERVICE':
          sendQuickReplies(id, 'Chọn một câu trả lời:', [
            {
              content_type: 'text',
              title: 'Bật thông báo',
              payload: 'ADD_CTMS_TIMETABLE_SERVICE',
              image_url: NOTI_IMAGE.on,
            },
            {
              content_type: 'text',
              title: 'Tắt thông báo',
              payload: 'REMOVE_CTMS_TIMETABLE_SERVICE',
              image_url: NOTI_IMAGE.off,
            },
          ]);
          return;
        default:
          return;
      }
    } else if (message) {
      const { quick_reply } = message;

      if (quick_reply) {
        switch (quick_reply?.payload) {
          case 'ADD_CTMS_ACCOUNT':
            sendLoginCtmsButton(id);
            return;
          case 'REMOVE_CTMS_ACCOUNT':
            removeCtmsAccount(id);
            return;
          case 'ADD_FITHOU_CRAWL_SERVICE':
            subscribedFithouNotification(id);
            return;
          case 'REMOVE_FITHOU_CRAWL_SERVICE':
            unsubFithouNotification(id);
            return;
          case 'ADD_CTMS_CREDITS_SERVICE':
            subCtmsSubject(id);
            return;
          case 'REMOVE_CTMS_CREDITS_SERVICE':
            unsubCtmsSubject(id);
            return;
          case 'ADD_CTMS_TIMETABLE_SERVICE':
            trackTimetable(id);
            return;
          case 'REMOVE_CTMS_TIMETABLE_SERVICE':
            unTrackTimetable(id);
            return;
          default:
            break;
        }
      } else {
        chatScript(id, message.text);
      }
    }
  }
};

export { handleWebhook };
