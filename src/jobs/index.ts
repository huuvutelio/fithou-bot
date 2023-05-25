import logger from 'logger';
import schedule from 'node-schedule';

const rule = new schedule.RecurrenceRule();
// your timezone
rule.tz = 'Asia/Ho_Chi_Minh';

import job from './crawlCtmsSubject';

const runjobs = () => {
  //Execute a cron job every 25 Minutes = */25 * * * *
  // schedule.scheduleJob('*/25 * * * *', crawlFithouJob);

  // schedule.scheduleJob('00 45 6 * * 0-6', morningSchedule);
  // schedule.scheduleJob('00 00 12 * * 0-6', noonSchedule);
  // schedule.scheduleJob('00 30 16 * * 0-6', eveningSchedule);
  // schedule.scheduleJob('00 00 20 * * 0-6', examDaySchedule);
  // schedule.scheduleJob('00 00 20 * * 0-6', examDaySchedule);
  logger.info('All jobs are running');
  job.start();
};

export default runjobs;
