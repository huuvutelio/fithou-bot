/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import config from 'config';
import md5 from 'md5';
import qs from 'qs';
import cheerio from 'cheerio';

const loginCtms = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${config.service.ctms}/login.aspx`,
      qs.stringify({
        ctl00$LeftCol$UserLogin1$txtUsername: username,
        ctl00$LeftCol$UserLogin1$txtPassword: md5(password),
        ctl00$LeftCol$UserLogin1$btnLogin: 'Đăng nhập',
        __VIEWSTATE: '/wEPDwUJNjgxODI3MDEzZGQYhImpueCRmFchkTJkEoLggX4C6Nz/NXMIzR9/49O/0g==',
        __VIEWSTATEGENERATOR: 'C2EE9ABB',
        __EVENTVALIDATION:
          '/wEdAAQxNFjzuCTBmG4Ry6gmDFTXMVDm8KVzqxEfMx7263Qx5VsdkPb56sD60m4bRwV1zT7o396vFnxqy4G+sdDoX0RYcT0vDsg4dG9gkFX2SUYDeTjkkBvsNMeyzTehazPIVNk=',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const dom = cheerio.load(response.data)('#LeftCol_UserLogin1_lblMess');

    return {
      cookie: response.headers['set-cookie'],
      isSuccess: !!response.data.includes('Xin chào mừng'),
      errorMsg: dom.text(),
    };
  } catch (err) {
    console.log(err);
    
    return {
      cookie: [],
      isSuccess: false,
      errorMsg: 'Lỗi kết nối',
    };
  }
};

const logoutCtms = async (cookie: Array<string>) => {
  try {
    await axios.post(
      `${config.service.ctms}/login.aspx`,
      qs.stringify({
        __VIEWSTATE: '/wEPDwUJNjgxODI3MDEzZGQYhImpueCRmFchkTJkEoLggX4C6Nz/NXMIzR9/49O/0g==',
        __VIEWSTATEGENERATOR: 'C2EE9ABB',
        __CALLBACKID: 'ctl00$QuanlyMenu1',
        __CALLBACKPARAM: 'logout',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: cookie.join('; '),
        },
      }
    );
  } catch (e) {
    console.log('logout errr:', e.message);
  }
};

export { loginCtms, logoutCtms };
