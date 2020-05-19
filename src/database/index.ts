import { createConnection } from 'typeorm';
import * as path from 'path';

createConnection({
  type: 'mysql',
  host: '54.233.223.179',
  port: 3306,
  username: 'eduardo',
  password: 'B@lpha9001',
  database: 'astpp',
  logging: false,
  entities: [
    path.resolve(__dirname, '..', 'models', '*{.ts,.js}'),
    // './src/models/*.ts',
  ],
});
