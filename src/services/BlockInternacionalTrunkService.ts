import { getRepository } from 'typeorm';

import Trunk from '../models/Trunk';

class BlockInternacionalTrunkService {
  public async execute(): Promise<void> {
    const trunkRepository = getRepository(Trunk);

    const brastelJpBypass = await trunkRepository.findOne({
      where: { id: 55 },
    });

    if (brastelJpBypass) {
      brastelJpBypass.status = 1;
      trunkRepository.save(brastelJpBypass);
    }

    const brastelJp = await trunkRepository.findOne({
      where: { id: 57 },
    });

    if (brastelJp) {
      brastelJp.status = 1;
      trunkRepository.save(brastelJp);
    }
  }
}

export default BlockInternacionalTrunkService;
