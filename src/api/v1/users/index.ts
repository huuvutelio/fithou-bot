import { Router } from 'express';
import { asyncRouteHandler } from 'middlewares';
import * as controller from './controller';

const router = Router();

router.get('/', asyncRouteHandler(controller.getAllUsers));
router.post('/noti', asyncRouteHandler(controller.sendNotiToUser));

export default router;
