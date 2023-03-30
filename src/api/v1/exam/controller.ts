import { Response } from 'express';

import RequestWithUser from 'utils/rest/request';
import * as service from './service';
import fmt from 'utils/formatter';
import { FetchUpcomingExamScheduleRequest } from './dto';

export const fetchUpcomingExamSchedule = async (request: RequestWithUser, response: Response) => {
  const input: FetchUpcomingExamScheduleRequest = request.body;

  const result = await service.fetchUpcomingExamSchedule(input);
  response.send(fmt.formatResponse(result, Date.now() - request.startTime, 'OK'));
};
