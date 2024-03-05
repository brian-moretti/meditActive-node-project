const fs = require("fs");
const { MongoConnectToDb, mySqlConnectAndQuery } = require("../Core/Database");
const GoalModel = require("../App/models/GoalModel");

let jsonData = JSON.parse(fs.readFileSync(`${__dirname}/goal.json`));

//* MYSQL
async function createGoals(json) {
  let query = `INSERT INTO ${GoalModel.name} (title, description) VALUES ?`;
  const values = json.map((element) => Object.values(element));
  return await mySqlConnectAndQuery(query, [values]);
}

//* MONGO
async function createMany(json) {
  const db = await MongoConnectToDb();
  return await db.collection(GoalModel.name).insertMany(json);
}

const importData = async () => {
  try {
    if (process.argv[2] === "--mongo") {
      await createMany(jsonData);
      console.log("Data imported successfully");
    } else if (process.argv[2] === "--mysql") {
      await createGoals(jsonData);
      console.log("Data imported successfully");
    } else {
    }
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

importData();
