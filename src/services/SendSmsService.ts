import AWS from 'aws-sdk';
import { getRepository } from 'typeorm';

import BasixSupportTable from '../models/BasixSupportTable';

class SendSmsService {
  public async execute(message: string): Promise<void> {
    const supportTableRepository = getRepository(BasixSupportTable);

    const phoneNumber = await supportTableRepository.findOne({
      where: { name: 'notity_phone_per_sms' },
    });

    AWS.config.update({ region: process.env.REGION });

    const params = {
      Message: message,
      PhoneNumber: phoneNumber?.value,
    };

    const publishTextPromise = new AWS.SNS({
      apiVersion: '2010-03-31',
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
    })
      .publish(params)
      .promise();

    publishTextPromise
      .then(function (data) {
        console.log(`MessageID is ${data.MessageId}`);
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });

    console.log(phoneNumber?.value);
  }
}

export default SendSmsService;
