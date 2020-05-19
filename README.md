-- Adicionar arquivo
´´´
ormconfig.json
{
  "type": "mysql",
  "host": "127.0.0.1",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "database",
  "logging": false,
  "entities": [
    "./src/models/*.ts"
  ]
}

´´´
