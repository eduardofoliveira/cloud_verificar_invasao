import { getRepository, Like, Raw } from 'typeorm';

import Cdr from '../models/Cdr';

interface ServiceReturn {
  totalCostLastHour: string;
  totalDebitLastHour: string;
}

class InternacionalCostService {
  public async execute(): Promise<ServiceReturn> {
    const cdrRepository = getRepository(Cdr);
    const cdrsInternacionalLastHour = await cdrRepository.find({
      callednum: Like('010%'),
      callstart: Raw(
        alias =>
          `${alias} Between NOW() + INTERVAL 2 HOUR and NOW() + INTERVAL 3 HOUR`,
      ),
    });

    const totalCostLastHour = cdrsInternacionalLastHour
      .reduce((soma, item): number => {
        // eslint-disable-next-line no-param-reassign
        soma += parseFloat(item.cost.toString());
        return soma;
      }, 0)
      .toFixed(2);

    const totalDebitLastHour = cdrsInternacionalLastHour
      .reduce((soma, item): number => {
        // eslint-disable-next-line no-param-reassign
        soma += parseFloat(item.debit.toString());
        return soma;
      }, 0)
      .toFixed(2);

    const retorno = {
      totalCostLastHour,
      totalDebitLastHour,
    };

    return retorno;
  }
}

export default InternacionalCostService;
