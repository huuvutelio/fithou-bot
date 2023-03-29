/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request } from 'express';
import { ArticlesModel } from 'models';
import { sendMessage } from 'services/facebook';
import { crawlFithouService } from 'services/fithou';
import { CRAWL_FITHOU_TYPE } from 'utils/constants';

export const crawlFithou = async (req: Request, next: NextFunction) => {
  try {
    const result = await crawlFithouService();

    return result;
  } catch (error) {
    next(error);
  }
};

export const sendCrawlToSubscriber = async (req: Request, next: NextFunction) => {
  try {
    const result: any = crawlFithouService();
    const oldArticles = ArticlesModel.findOne();

    const resolveAll = await Promise.all([result, oldArticles]);

    const subscribers = resolveAll[1] && resolveAll[1].toObject().subscribedIDs;

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

    return resolveAll[0];
  } catch (error) {
    next(error);
  }
};

export const sendNotiForUserOfFithou = async (req: Request, next: NextFunction) => {
  try {
    const { message } = req.body;
    const aticles = await ArticlesModel.findOne();
    const users = aticles?.subscribedIDs;
    for (const element of users) {
      await sendMessage(element, {
        text: `${message}`,
      });
    }
    return message;
  } catch (error) {
    next(error);
  }
};

export const getTheNumberOfUsersFithouTool = async (req: Request, next: NextFunction) => {
  try {
    const aticles = await ArticlesModel.findOne();
    const users = aticles?.subscribedIDs;

    return users.length;
  } catch (error) {
    next(error);
  }
};
