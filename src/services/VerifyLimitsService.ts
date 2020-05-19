import { getRepository } from 'typeorm';

import BasixSupportTable from '../models/BasixSupportTable';
import SendMailService from './SendMailService';
import GenerateHtmlTemplateService from './GenerateHtmlTemplateService';
// import SendSmsService from './SendSmsService';

interface Request {
  callerid: string;
  debit: string;
  cost: string;
  quantity: string;
}

class VerifyLimitsService {
  public async execute(costLastHourByDid: Request[]): Promise<void> {
    const supportTableRepository = getRepository(BasixSupportTable);
    const sendMailService = new SendMailService();
    // const sendSmsService = new SendSmsService();
    const generateHtmlTemplateService = new GenerateHtmlTemplateService();

    const maxCallLimitPerHour = await supportTableRepository.findOne({
      where: { name: 'max_call_count_internacional_per_hour' },
    });

    const maxValueLimitPerHour = await supportTableRepository.findOne({
      where: { name: 'max_value_internacional_per_hour' },
    });

    const costLastHourByDidFiltred = costLastHourByDid.map(item => {
      const number = item.callerid.match(/<(.*)>/);
      if (number) {
        const [, did] = number;
        // eslint-disable-next-line no-param-reassign
        item.callerid = did;
      }

      return item;
    });

    if (maxCallLimitPerHour && maxValueLimitPerHour) {
      const excederamQuantidade = costLastHourByDidFiltred.filter(
        originador =>
          parseInt(originador.quantity, 10) >
          parseInt(maxCallLimitPerHour?.value, 10),
      );

      const excederamValor = costLastHourByDidFiltred.filter(
        originador =>
          parseFloat(originador.debit) >
          parseFloat(maxValueLimitPerHour?.value),
      );

      if (excederamQuantidade.length > 0 || excederamValor.length > 0) {
        sendMailService.execute(
          generateHtmlTemplateService.execute('invasao', {
            excederamValor,
            excederamQuantidade,
          }),
        );

        // const smsMessageValor = excederamValor.reduce((message, originador) => {
        //   // eslint-disable-next-line no-param-reassign
        //   message += `${originador.callerid} - ${originador.cost}\r\n`;
        //   return message;
        // }, '');

        // const smsMessageQuantidade = excederamQuantidade.reduce(
        //   (message, originador) => {
        //     // eslint-disable-next-line no-param-reassign
        //     message += `${originador.callerid} - ${originador.cost}\r\n`;
        //     return message;
        //   },
        //   '',
        // );

        // sendSmsService.execute(smsMessageValor + smsMessageQuantidade);
        // console.log({ smsMessageValor, smsMessageQuantidade });
      }
    }
  }
}

export default VerifyLimitsService;
