const { ObjectId } = require("mongodb");
const { connectToDb } = require("../../Core/Database");
const { collection: userCollection } = require("./user");
const { collection: goalCollection } = require("./goal");

class IntervalTarget {
  static collection = "interval_target";

  static async getAll(req) {
    const db = await connectToDb();
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
      .collection(this.collection)
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
      .toArray();
  }

  static async getIntervalTarget(id) {
    const db = await connectToDb();
    if (ObjectId.isValid(id)) {
      return await db
        .collection(this.collection)
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
    const db = await connectToDb();
    body.date_start = new Date(body.date_start);
    body.date_end = new Date(body.date_end);
    body.user_id = new ObjectId(body.user_id);
    body.goal_id = new ObjectId(body.goal_id);
    return await db.collection(this.collection).insertOne(body);
  }

  static async updateIntervalTarget(currentData, body) {
    const db = await connectToDb();
    let newBody = {
      date_start: new Date(body.date_start) ?? currentData.date_start,
      date_end: new Date(body.date_end) ?? currentData.date_end,
      goal_id: new ObjectId(body.goal_id) ?? currentData.goal_id,
      _id: currentData._id,
    };
    if (ObjectId.isValid(currentData._id)) {
      return await db
        .collection(this.collection)
        .updateOne({ _id: currentData._id }, { $set: newBody });
    } else {
      throw new Error("Id not valid");
    }
  }

  static async deleteIntervalTarget(id) {
    const db = await connectToDb();
    if (ObjectId.isValid(id)) {
      let deletedInterval = await this.getIntervalTarget(id);
      const result = await db
        .collection(this.collection)
        .deleteOne({ _id: new ObjectId(id) });
      return [result, deletedInterval];
    } else {
      throw new Error("Id not valid");
    }
  }
}

module.exports = IntervalTarget;
