import { Router } from 'express';

import verifyRouter from './verify.routes';

const routes = Router();

routes.use('/verify', verifyRouter);

export default routes;
