import axios from 'axios';
import logger from 'logger';
import { crawlFithouService } from 'services/fithou';

export const test = async () => {
  const result = await crawlFithouService();

  const subscribers = result.subscribedIDs;

  if (!result?.data) {
    logger.warn(`There is not an article in the db`);
    return;
  }

  // for (const userId of subscribers) {
  //   const res = axios.get('http://localhost:3000');
  //   console.log(`res: ${res} - ${userId} for ${new Date()}`);
  // }

  const a = await Promise.all(subscribers.map((_) => axios.get('http://localhost:3000')));

  for (const iterator of a) {
    console.log(`res: ${iterator.data.data} - for ${new Date()}`);
  }
};
