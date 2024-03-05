const { ObjectId } = require("mongodb");
const { MongoConnectToDb } = require("../../../Core/Database");
const GoalModel = require("../GoalModel");
const paginations = require("../../../Core/utilities/paginations");

class MongoGoalModel extends GoalModel {
  constructor() {
    super();
  }

  static async getAll(params) {
    let p = paginations(params);
    const db = await MongoConnectToDb();
    return await db
      .collection(GoalModel.name)
      .find()
      .sort({ _id: 1 })
      .skip(p.offsetData)
      .limit(p.maxData)
      .toArray();
  }

  static async getGoal(id) {
    const db = await MongoConnectToDb();
    if (ObjectId.isValid(id)) {
      return await db
        .collection(GoalModel.name)
        .findOne({ _id: new ObjectId(id) });
    } else {
      throw new Error("Id not valid");
    }
  }

  static async createGoal(body) {
    const db = await MongoConnectToDb();
    return await db.collection(GoalModel.name).insertOne(body);
  }

  static async updateGoal(currentData, body) {
    const db = await MongoConnectToDb();
    let newBody = {
      title: body.title ?? currentData.title,
      description: body.description ?? currentData.description,
      _id: currentData._id,
    };
    if (ObjectId.isValid(currentData._id)) {
      return await db
        .collection(GoalModel.name)
        .updateOne({ _id: currentData._id }, { $set: newBody });
    } else {
      throw new Error("Id not valid");
    }
  }

  static async deleteGoal(id) {
    const db = await MongoConnectToDb();
    if (ObjectId.isValid(id)) {
      let deletedGoal = await this.getGoal(id);
      const result = await db
        .collection(GoalModel.name)
        .deleteOne({ _id: new ObjectId(id) });
      return [result, deletedGoal];
    } else {
      throw new Error("Id not valid");
    }
  }
}

module.exports = MongoGoalModel;
