const MongoGoalModel = require("../../App/models/MongoModels/MongoGoalModel");
const MongoIntervalTargetModel = require("../../App/models/MongoModels/MongoIntervalTargetModel");
const MongoUserModel = require("../../App/models/MongoModels/MongoUserModel");
const MySqlGoalModel = require("../../App/models/MySqlModels/MySqlGoalModel");
const MySqlIntervalTargetModel = require("../../App/models/MySqlModels/MySqlIntervalTargetModel");
const MySqlUserModel = require("../../App/models/MySqlModels/MySqlUserModel");

function useDatabase() {
  if (process.argv[2] === "--mysql") {
    return {
      MySql: {
        users: MySqlUserModel,
        interval_targets: MySqlIntervalTargetModel,
        goals: MySqlGoalModel,
      },
    };
  } else if (process.argv[2] === "--mongo") {
    return {
      Mongo: {
        users: MongoUserModel,
        interval_targets: MongoIntervalTargetModel,
        goals: MongoGoalModel,
      },
    };
  } else {
    console.error(
      "A database must be specified. Please check README file of the project"
    );
    process.exit();
  }
}

module.exports = useDatabase;
