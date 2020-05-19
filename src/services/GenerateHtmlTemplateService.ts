import ejs from 'ejs';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Request {
  callerid: string;
  debit: string;
  cost: string;
  quantity: string;
}

class GenerateHtmlTemplateService {
  public execute(
    nome_arquivo: string,
    dados: {
      excederamValor: Request[];
      excederamQuantidade: Request[];
    },
  ): string {
    const path = join(__dirname, '..', `template/${nome_arquivo}.ejs`);
    return ejs.compile(readFileSync(path, 'utf8'), { filename: path })(dados);
  }
}

export default GenerateHtmlTemplateService;
