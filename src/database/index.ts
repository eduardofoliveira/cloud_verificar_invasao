import { createConnection } from 'typeorm';
import * as path from 'path';

if (process.env.ENVIRONMENT === 'development') {
  createConnection({
    type: 'mysql',
    host: '54.233.223.179',
    port: 3306,
    username: 'eduardo',
    password: 'B@lpha9001',
    database: 'astpp',
    logging: false,
    entities: [path.resolve(__dirname, '..', 'models', '*{.ts,.js}')],
  });
} else {
  createConnection({
    type: 'mysql',
    host: '54.233.223.179',
    extra: {
      socketPath: '/run/mysqld/mysqld.sock',
    },
    port: 3306,
    username: 'eduardo',
    password: 'B@lpha9001',
    database: 'astpp',
    logging: false,
    entities: [path.resolve(__dirname, '..', 'models', '*{.ts,.js}')],
  });
}
