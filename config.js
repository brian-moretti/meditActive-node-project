require("dotenv").config();

const configMySqlDb = {
  host: process.env.CONNECTION,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_MYSQL_PASS,
  database: process.env.DB_MYSQL_NAME,
};

const configMongoDb = {
  mongo_connection: process.env.MONGO_CONN,
  user: process.env.DB_USER,
  password: process.env.DB_MONGO_PASS,
  mongo_project: process.env.MONGO_PROJECT,
  database: process.env.DB_MONGO_NAME,
  db_option: process.env.OPTION,
};

module.exports = { configMySqlDb, configMongoDb };
