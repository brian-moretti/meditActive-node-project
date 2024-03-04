const fs = require("fs");
const Goal = require("../App/models/goal");
const { MongoConnectToDb } = require("../Core/Database");

let jsonData = JSON.parse(fs.readFileSync(`${__dirname}/goal.json`));

async function createMany(json) {
  const db = await MongoConnectToDb();
  return await db.collection(Goal.collection).insertMany(json);
}

const importData = async () => {
  try {
    await createMany(jsonData);
    console.log("Data imported successfully");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

importData();
