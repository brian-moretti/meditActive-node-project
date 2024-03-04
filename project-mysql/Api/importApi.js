const fs = require("fs");
const Goal = require("../App/models/Goal");
const mySqlConnectAndQuery = require("../Core/Database");

let jsonData = JSON.parse(fs.readFileSync(`${__dirname}/goal.json`));

async function createGoals(json) {
  let query = `INSERT INTO ${Goal.tableName} (title, description) VALUES ?`;
  const values = json.map((element) => Object.values(element));
  return await mySqlConnectAndQuery(query, [values]);
}

const importData = async () => {
  try {
    await createGoals(jsonData);
    console.log("Data imported successfully");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

importData();
