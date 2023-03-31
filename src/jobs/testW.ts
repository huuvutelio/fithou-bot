/* eslint-disable @typescript-eslint/no-loop-func */
import { createPool } from 'generic-pool';
import logger from 'logger';
import { crawlFithouService } from 'services/fithou';
import { workerTs } from 'workers';
import { Worker } from 'worker_threads';
import path from 'path';

const workerPath = path.join(__dirname, '../workers/testW.ts');

export const testW = async () => {
  const result = await crawlFithouService();

  const subscribers = result.subscribedIDs;

  if (!result?.data) {
    logger.warn(`There is not an article in the db`);
    return;
  }

  for (const userId of subscribers) {
    const workerFactory: any = {
      create: () => workerTs(workerPath, { workerData: {} }),
      destroy: (worker: any) => worker.terminate(),
    };

    const pool = createPool(workerFactory, { max: 4 });
    const worker = (await pool.acquire()) as Worker;

    worker.on('message', function (message: any) {
      console.log(`res: ${message?.data?.data} - ${userId} for ${new Date()}`);
      pool.release(worker);
    });

    worker.on('error', (error: any) => {
      console.error(`Lỗi từ worker cho ${userId}:`, error);
      pool.release(worker);
    });

    await pool.drain();
    await pool.clear();
  }
};
