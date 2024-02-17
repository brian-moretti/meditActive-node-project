const { ObjectId } = require("mongodb");
const { connectToDb } = require("../../Core/Database");

class Goal {
  static collection = "goal";

  static async getAll() {
    const db = await connectToDb();
    return await db.collection(this.collection).find().toArray();
  }

  static async getGoal(id) {
    const db = await connectToDb();
    if (ObjectId.isValid(id)) {
      return await db
        .collection(this.collection)
        .findOne({ _id: new ObjectId(id) });
    } else {
      throw new Error("Id not valid");
    }
  }

  static async createGoal(body) {
    const db = await connectToDb();
    return await db.collection(this.collection).insertOne(body);
  }

  static async updateGoal(currentData, body) {
    const db = await connectToDb();
    let newBody = {
      title: body.title ?? currentData.title,
      description: body.description ?? currentData.description,
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

  static async deleteGoal(id) {
    const db = await connectToDb();
    if (ObjectId.isValid(id)) {
      let deletedGoal = await this.getGoal(id);
      const result = await db
        .collection(this.collection)
        .deleteOne({ _id: new ObjectId(id) });
      return [result, deletedGoal];
    } else {
      throw new Error("Id not valid");
    }
  }
}

module.exports = Goal;
