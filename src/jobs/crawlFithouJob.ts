import logger from 'logger';
import { ArticlesModel } from 'models';
import { sendMessage } from 'services/facebook';
import { crawlFithouService } from 'services/fithou';
import { CRAWL_FITHOU_TYPE } from 'utils/constants';

export const crawlFithouJob = async () => {
  const result: any = crawlFithouService();
  const oldArticles = ArticlesModel.findOne();

  const resolveAll = await Promise.all([result, oldArticles]);

  const subscribers = resolveAll[1] && resolveAll[1].toObject().subscribedIDs;

  if (!resolveAll[0]?.data || !subscribers) {
    logger.warn(`There is not an article in the db`);
    return;
  }

  if (resolveAll[0]?.type === CRAWL_FITHOU_TYPE.oneRecord || resolveAll[0]?.type === CRAWL_FITHOU_TYPE.new) {
    for (const element of subscribers) {
      sendMessage(element, {
        text: `${resolveAll[0]?.data?.title} \n ${resolveAll[0]?.data?.link}`,
      });
    }
  }

  if (resolveAll[0]?.type === CRAWL_FITHOU_TYPE.manyRecords) {
    for (const element of subscribers) {
      for (let j = 0; j < resolveAll[0]?.data?.length; j++) {
        sendMessage(element, {
          text: `${resolveAll[0]?.data[j]?.title} \n ${resolveAll[0]?.data[j]?.link}`,
        });
      }
    }
  }
  logger.info(`crawlFithouJob is running at ${new Date()}`);
};
