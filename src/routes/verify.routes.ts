import { Router } from 'express';

import VerifyCostLastHourService from '../services/VerifyCostLastHourService';

const verifyRouter = Router();

verifyRouter.get('/internacional/lasthour', async (req, res) => {
  const verifyCostLastHourService = new VerifyCostLastHourService();
  const status = await verifyCostLastHourService.execute();

  return res.json(status);
});

export default verifyRouter;
