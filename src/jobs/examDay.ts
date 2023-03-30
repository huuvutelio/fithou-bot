import logger from 'logger';
import { UserModel } from 'models';
import User from 'models/types/User';
import { fetchUpcomingExamSchedule } from 'api/v1/exam/service';

export const examDaySchedule = async () => {
  try {
    const users: User[] = await UserModel.find({ isExamDay: true });

    for (const user of users) {
      await fetchUpcomingExamSchedule({
        username: user.username,
        password: user.password,
        subscribedID: user.subscribedID,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};
