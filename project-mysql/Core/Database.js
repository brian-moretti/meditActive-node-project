const mySql = require("mysql2/promise");
const { MongoClient } = require("mongodb");
const { configMySqlDb, configMongoDb } = require("../config");

//* MYSQL DATABASE SECTION

async function mySqlConnectAndQuery(query, params) {
  const connect = await mySql.createConnection(configMySqlDb);
  let statement;
  try {
    [statement] = await connect.query(query, params);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await connect.end();
  }
  return statement;
}

//* MONGO DATABASE SECTION

const uriDynamic = `${configMongoDb.mongo_connection}${configMongoDb.user}:${configMongoDb.password}@${configMongoDb.mongo_project}/${configMongoDb.database}${configMongoDb.db_option}`;

const client = new MongoClient(uriDynamic);

async function MongoConnectToDb() {
  try {
    await client.connect();
    return client.db();
  } catch (error) {
    return error;
  }
}

module.exports = { mySqlConnectAndQuery, MongoConnectToDb };
