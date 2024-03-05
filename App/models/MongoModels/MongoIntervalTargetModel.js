const { ObjectId } = require("mongodb");
const { MongoConnectToDb } = require("../../../Core/Database");
const IntervalTargetModel = require("../IntervalTargetModel");
const paginations = require("../../../Core/utilities/paginations");
const { name: userCollection } = require("../UserModel");
const { name: goalCollection } = require("../GoalModel");

class MongoIntervalTargetModel extends IntervalTargetModel {
  constructor() {
    super();
  }
  static async getAll(req) {
    const db = await MongoConnectToDb();
    let p = paginations(req);
    let fromDateStart = req.date_start ?? null;
    let fromDateEnd = req.date_end ?? null;
    let goalTitle = req.goal_title ?? null;
    let filter = {};

    if (fromDateStart > fromDateEnd) {
      throw new Error("Date");
    }

    if (fromDateStart) {
      filter.date_start = { $gte: new Date(fromDateStart) };
    }
    if (fromDateEnd) {
      filter.date_end = { $lte: new Date(fromDateEnd) };
    }
    if (goalTitle) {
      filter["Goal.title"] = { $regex: `^${goalTitle}`, $options: "i" };
    }
    return await db
      .collection(IntervalTargetModel.name)
      .aggregate([
        {
          $lookup: {
            from: userCollection,
            localField: "user_id",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $lookup: {
            from: goalCollection,
            localField: "goal_id",
            foreignField: "_id",
            as: "Goal",
          },
        },
        { $match: filter },
        {
          $project: {
            user_id: 0,
            goal_id: 0,
          },
        },
      ])
      .skip(p.offsetData)
      .limit(p.maxData)
      .toArray();
  }

  static async getIntervalTarget(id) {
    const db = await MongoConnectToDb();
    if (ObjectId.isValid(id)) {
      return await db
        .collection(IntervalTargetModel.name)
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: userCollection,
              localField: "user_id",
              foreignField: "_id",
              as: "User",
            },
          },
          {
            $lookup: {
              from: goalCollection,
              localField: "goal_id",
              foreignField: "_id",
              as: "Goal",
            },
          },
          {
            $project: {
              user_id: 0,
              goal_id: 0,
            },
          },
          //$replaceroot for ? + $project for properties
        ])
        .toArray();
    } else {
      throw new Error("Id not valid");
    }
  }

  static async createIntervalTarget(body) {
    const db = await MongoConnectToDb();
    body.date_start = new Date(body.date_start);
    body.date_end = new Date(body.date_end);
    body.user_id = new ObjectId(body.user_id);
    body.goal_id = new ObjectId(body.goal_id);
    return await db.collection(IntervalTargetModel.name).insertOne(body);
  }

  static async updateIntervalTarget(currentData, body) {
    const db = await MongoConnectToDb();
    let newBody = {
      date_start: new Date(body.date_start) ?? currentData.date_start,
      date_end: new Date(body.date_end) ?? currentData.date_end,
      goal_id: new ObjectId(body.goal_id) ?? currentData.goal_id,
      _id: currentData._id,
    };
    if (ObjectId.isValid(currentData._id)) {
      return await db
        .collection(IntervalTargetModel.name)
        .updateOne({ _id: currentData._id }, { $set: newBody });
    } else {
      throw new Error("Id not valid");
    }
  }

  static async deleteIntervalTarget(id) {
    const db = await MongoConnectToDb();
    if (ObjectId.isValid(id)) {
      let deletedInterval = await this.getIntervalTarget(id);
      const result = await db
        .collection(IntervalTargetModel.name)
        .deleteOne({ _id: new ObjectId(id) });
      return [result, deletedInterval];
    } else {
      throw new Error("Id not valid");
    }
  }
}

module.exports = MongoIntervalTargetModel;
