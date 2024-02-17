const mySql = require("mysql2/promise");
const configDb = require("../config");

async function connectAndQuery(query, params) {
  const connect = await mySql.createConnection(configDb);
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

module.exports = connectAndQuery;
