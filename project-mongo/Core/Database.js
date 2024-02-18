const { MongoClient } = require("mongodb");
const configDb = require("../config");

// URI when config is defined globally
const uriDynamic = `${configDb.mongo_connection}${configDb.user}:${configDb.password}@${configDb.mongo_project}/${configDb.database}${configDb.db_option}`;

// URI when config is defined in local for testing
const uriStatic =
  "mongodb+srv://root:qvtQtW2yO8ABDIpG@project-node-s2i.dl6rpik.mongodb.net/meditActive-project?retryWrites=true&w=majority";

const client = new MongoClient(uriStatic);

async function connectToDb() {
  try {
    await client.connect();
    return client.db();
  } catch (error) {
    return error;
  }
}

module.exports = { connectToDb };
