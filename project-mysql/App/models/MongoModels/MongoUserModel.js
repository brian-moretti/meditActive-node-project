const { ObjectId } = require("mongodb");
const { MongoConnectToDb } = require("../../../Core/Database");
const UserModel = require("../UserModel");
const paginations = require("../../../utilities/paginations");

class MongoUserModel extends UserModel {
  constructor() {
    super();
  }

  static async getAll(params) {
    let p = paginations(params);
    const db = await MongoConnectToDb();
    return await db
      .collection(UserModel.name)
      .find()
      .sort({ name: 1 })
      .skip(p.offsetData)
      .limit(p.maxData)
      .toArray();
  }

  static async getUser(id) {
    const db = await MongoConnectToDb();
    if (ObjectId.isValid(id)) {
      return await db
        .collection(UserModel.name)
        .findOne({ _id: new ObjectId(id) });
    } else {
      throw new Error("Id not valid");
    }
  }

  static async createUser(body) {
    const db = await MongoConnectToDb();
    return await db.collection(UserModel.name).insertOne(body);
  }

  static async updateUser(currentData, body) {
    const db = await MongoConnectToDb();
    let newBody = {
      name: body.name ?? currentData.name,
      surname: body.surname ?? currentData.surname,
      email: body.email ?? currentData.email,
      _id: currentData._id,
    };
    if (ObjectId.isValid(currentData._id)) {
      return await db
        .collection(UserModel.name)
        .updateOne({ _id: currentData._id }, { $set: newBody });
    } else {
      throw new Error("Id not valid");
    }
  }

  static async deleteUser(id) {
    const db = await MongoConnectToDb();
    if (ObjectId.isValid(id)) {
      let deletedUser = await this.getUser(id);
      const result = await db
        .collection(UserModel.name)
        .deleteOne({ _id: new ObjectId(id) });
      return [result, deletedUser];
    } else {
      throw new Error("Id not valid");
    }
  }
}

module.exports = MongoUserModel;
