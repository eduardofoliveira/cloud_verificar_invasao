import { getRepository } from 'typeorm';
import axios from 'axios';

import BasixSupportTable from '../models/BasixSupportTable';
import SendMailService from './SendMailService';
import GenerateHtmlTemplateService from './GenerateHtmlTemplateService';
import BlockInternacionalTrunkService from './BlockInternacionalTrunkService';
// import SendSmsService from './SendSmsService';

interface CostLastHour {
  totalCostLastHour: string;
  totalDebitLastHour: string;
}

interface CostLastHourByDid {
  callerid: string;
  domain: string;
  debit: string;
  cost: string;
  quantity: string;
}

class VerifyLimitsService {
  public async execute(
    costLastHourByDid: CostLastHourByDid[],
    costLastHour: CostLastHour,
  ): Promise<void> {
    const supportTableRepository = getRepository(BasixSupportTable);
    const sendMailService = new SendMailService();
    const blockInternacionalTrunkService = new BlockInternacionalTrunkService();
    // const sendSmsService = new SendSmsService();
    const generateHtmlTemplateService = new GenerateHtmlTemplateService();

    const maxCallLimitPerHour = await supportTableRepository.findOne({
      where: { name: 'max_call_count_internacional_per_hour' },
    });

    const maxValueLimitPerHour = await supportTableRepository.findOne({
      where: { name: 'max_value_internacional_per_hour' },
    });

    const maxValueTrunkPerHour = await supportTableRepository.findOne({
      where: { name: 'max_value_trunk_internacional_per_hour' },
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

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < costLastHourByDidFiltred.length; i++) {
      const element = costLastHourByDidFiltred[i];

      // eslint-disable-next-line no-await-in-loop
      const { data } = await axios.get(
        `http://35.171.122.245:85/api/basix/domain/${element.callerid}`,
      );

      costLastHourByDidFiltred[i].domain = data.domain;
    }

    if (maxValueTrunkPerHour) {
      if (
        parseFloat(costLastHour.totalDebitLastHour) >
        parseFloat(maxValueTrunkPerHour.value)
      ) {
        blockInternacionalTrunkService.execute();
        sendMailService.execute(
          generateHtmlTemplateService.execute('bloqueio-geral', {
            excederamValor: [],
            excederamQuantidade: [],
          }),
        );
      }
    }

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

        excederamQuantidade.map(originador => {
          axios.post(`http://35.171.122.245:85/api/alterar`, {
            acao: 2,
            lista: [originador.callerid],
          });
          return originador;
        });

        excederamValor.map(originador => {
          axios.post(`http://35.171.122.245:85/api/alterar`, {
            acao: 2,
            lista: [originador.callerid],
          });
          return originador;
        });

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
