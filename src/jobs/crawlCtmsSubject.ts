import { UserModel } from 'models';
import { getSubjects, getSubjectsInHTML, getUserID, loginCtms, logoutCtms } from 'services/ctms';
import { sendMessage, sendSubjectCtms, unsubCtmsSubject, unTrackTimetable } from 'services/facebook';
import { SimpleIntervalJob, Task } from 'toad-scheduler';

const task = new Task('simple task', async () => {
  console.log('crawlCtmsSubject running', new Date());
  const users = await UserModel.find({
    isSubscribedSubject: true,
  });

  users.forEach(async (user) => {
    const { isSuccess, errorMsg, cookie } = await loginCtms(user.username, user.password);
    if (isSuccess) {
      try {
        const userId = await getUserID(cookie);
        const html = await getSubjects(cookie, userId);
        const subjects = await getSubjectsInHTML(html);
        console.log('subjects of ' + user.username, subjects);

        // const validSubjects = subjects.filter((subject) => subject.status);
        const validSubjects = subjects.filter((subject) => subject.status);

        validSubjects.forEach(async (subject) => {
          if (user.validSubjects.some((s) => s.subjectCode === subject.subjectCode)) {
            return;
          } else {
            await UserModel.updateOne(
              {
                _id: user._id,
              },
              {
                $set: {
                  validSubjects: [...user.validSubjects, subject],
                },
              }
            );
          }
          sendMessage(user.subscribedID, {
            text: `Có môn đang mở: ${subject.subjectCode} - ${subject.subjectName}`,
          });
        });

        await UserModel.updateOne(
          {
            _id: user._id,
          },
          {
            $set: {
              validSubjects,
            },
          }
        );
      } catch (e) {
        console.log('errrr', e);
      }

      // await sendSubjectCtms([user.subscribedID], cookie, user.username);
    } else {
      if (errorMsg.trim() === 'Sai Tên đăng nhập hoặc Mật khẩu') {
        // await sendMessage(user.subscribedID, {
        //   text: `CTMS BOT: ${user.username} - ${errorMsg}`,
        // });
        // await unsubCtmsSubject(user.subscribedID);
        // await unTrackTimetable(user.subscribedID);
      }

      console.log('err', errorMsg);
    }
    logoutCtms(cookie);
  });

  console.log('crawlCtmsSubject running 2');
});

const job = new SimpleIntervalJob({ seconds: 60 * 60, runImmediately: true }, task);

export default job;
