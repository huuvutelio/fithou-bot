import axios from 'axios';
import * as cheerio from 'cheerio';

import { loginCtms, logoutCtms } from 'services/ctms';
import { EXPIRED_CTMS, SCHOOL_SCHEDULE_URL, todayformatted } from 'utils/constants';
import logger from 'logger';
import { removeCtmsUserByEmail } from 'api/v1/users/service';

const checkSession = (session: string) => {
  if (session.match('07:30')) {
    return 'Sáng';
  }

  if (session.match('13:00')) {
    return 'Chiều';
  }

  if (session.match('17:15')) {
    return 'Tối';
  }
};

export const schoolScheduleService = async (username: string, password: string) => {
  try {
    const login = await loginCtms(username, password);

    const cookie = login.cookie.join('; ');

    if (login.isSuccess) {
      const dom = await axios.get(SCHOOL_SCHEDULE_URL, {
        headers: {
          Cookie: cookie,
        },
      });

      const $ = cheerio.load(dom.data);

      const expiredNotiText = $('#leftcontent #thongbao').text().trim();
      if (expiredNotiText === EXPIRED_CTMS) {
        return {
          isExpired: true,
        };
      }

      let list = {};
      $('#leftcontent #LeftCol_Lichhoc1_pnView div').each(function (index, element) {
        const day = $(element).children('b')?.text()?.trim()?.split('\n')[1]?.trim();
        if (day === todayformatted()) {
          let sessionOne: any[] = [];
          let sessionTwo: any[] = [];
          let sessionThree: any[] = [];

          let sessionTemp: any[] = [];

          let sessionOneCheck = false;
          let sessionTwoCheck = false;
          let sessionThreeCheck = false;

          $(element)
            .children('div')
            .children('table')
            .children('tbody')
            .children('tr')
            .eq(1)
            .children('td')
            .each(function (indexSecond, elementSecond) {
              const check = checkSession($(elementSecond).text()?.trim());

              sessionTemp.push($(elementSecond).text()?.trim());

              if (check === 'Sáng') {
                sessionOneCheck = true;
              } else if (check === 'Chiều') {
                sessionTwoCheck = true;
              } else if (check === 'Tối') {
                sessionThreeCheck = true;
              }

              if (indexSecond === 6) {
                if (sessionOneCheck) {
                  sessionOne = sessionTemp;
                  sessionTemp = [];
                  sessionOneCheck = false;
                } else if (sessionTwoCheck) {
                  sessionTwo = sessionTemp;
                  sessionTemp = [];
                  sessionTwoCheck = false;
                } else if (sessionThreeCheck) {
                  sessionThree = sessionTemp;
                  sessionTemp = [];
                  sessionThreeCheck = false;
                }
              }
            });

          $(element)
            .children('div')
            .children('table')
            .children('tbody')
            .children('tr')
            .eq(2)
            .children('td')
            .each(function (indexSecond, elementSecond) {
              const check = checkSession($(elementSecond).text()?.trim());

              sessionTemp.push($(elementSecond).text()?.trim());

              if (check === 'Sáng') {
                sessionOneCheck = true;
              } else if (check === 'Chiều') {
                sessionTwoCheck = true;
              } else if (check === 'Tối') {
                sessionThreeCheck = true;
              }

              if (indexSecond === 6) {
                if (sessionOneCheck) {
                  sessionOne = sessionTemp;
                  sessionTemp = [];
                  sessionOneCheck = false;
                } else if (sessionTwoCheck) {
                  sessionTwo = sessionTemp;
                  sessionTemp = [];
                  sessionTwoCheck = false;
                } else if (sessionThreeCheck) {
                  sessionThree = sessionTemp;
                  sessionTemp = [];
                  sessionThreeCheck = false;
                }
              }
            });

          $(element)
            .children('div')
            .children('table')
            .children('tbody')
            .children('tr')
            .eq(3)
            .children('td')
            .each(function (indexSecond, elementSecond) {
              const check = checkSession($(elementSecond).text()?.trim());

              sessionTemp.push($(elementSecond).text()?.trim());

              if (check === 'Sáng') {
                sessionOneCheck = true;
              } else if (check === 'Chiều') {
                sessionTwoCheck = true;
              } else if (check === 'Tối') {
                sessionThreeCheck = true;
              }

              if (indexSecond === 6) {
                if (sessionOneCheck) {
                  sessionOne = sessionTemp;
                  sessionTemp = [];
                  sessionOneCheck = false;
                } else if (sessionTwoCheck) {
                  sessionTwo = sessionTemp;
                  sessionTemp = [];
                  sessionTwoCheck = false;
                } else if (sessionThreeCheck) {
                  sessionThree = sessionTemp;
                  sessionTemp = [];
                  sessionThreeCheck = false;
                }
              }
            });

          list = {
            sessionOne,
            sessionTwo,
            sessionThree,
          };
        }
      });

      logoutCtms(login.cookie);

      return list;
    }

    if (login.isRemove) {
      await removeCtmsUserByEmail(
        username,
        'Tài khoản CTMS của bạn đã bị đổi mật khẩu, vui lòng đăng nhập lại để sử dụng dịch vụ nha!🥲'
      );
    }

    return login;
  } catch (error) {
    logger.error(error);
  }
};
