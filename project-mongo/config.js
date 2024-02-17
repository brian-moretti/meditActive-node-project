require("dotenv").config();

const configDb = {
  mongo_connection: process.env.MONGO_CONN,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  mongo_project: process.env.MONGO_PROJECT,
  database: process.env.DB_NAME,
  db_option: process.env.OPTION,
};

module.exports = configDb;
