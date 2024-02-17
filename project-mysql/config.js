require("dotenv").config();

const configDb = {
  host: process.env.CONNECTION,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

module.exports = configDb;
