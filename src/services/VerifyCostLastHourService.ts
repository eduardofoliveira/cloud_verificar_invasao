import { getConnection } from 'typeorm';
import { format } from 'date-fns';

import InternacionalCostLastHourService from './InternacionalCostLastHourService';
import VerifyLimitsService from './VerifyLimitsService';

interface ServiceReturn {
  date: string;
  costLastHourByDid: [];
  totalCostLastHour: string;
  totalDebitLastHour: string;
}

class VerifyCostLastHourService {
  public execute = async (): Promise<ServiceReturn> => {
    const internacionalCostLastHourService = new InternacionalCostLastHourService();
    const verifyLimitsService = new VerifyLimitsService();

    const costLastHour = await internacionalCostLastHourService.execute();

    const costLastHourByDid = await getConnection().query(`
      SELECT
        callerid,
        SUM(debit) AS debit,
        SUM(cost) AS cost,
        COUNT(*) AS quantity
      FROM
        cdrs c
      WHERE
        c.callednum LIKE '010%' and
        c.callstart BETWEEN NOW() + INTERVAL 2 HOUR and NOW() + INTERVAL 3 HOUR
      GROUP BY
        callerid
    `);

    verifyLimitsService.execute(costLastHourByDid);

    const retorno = {
      ...costLastHour,
      date: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
      costLastHourByDid,
    };

    return retorno;
  };
}

export default VerifyCostLastHourService;
