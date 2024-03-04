const { mySqlConnectAndQuery } = require("../../../Core/Database");
const paginations = require("../../../utilities/paginations");
const UserModel = require("../UserModel");

class MySqlUserModel extends UserModel {
  constructor(/*paramas*/) {
    super(/*property from UserModel constructor*/);
  }

  static async getAll(params) {
    let p = paginations(params);
    const query = `SELECT * FROM ${UserModel.name} LIMIT ${p.maxData} OFFSET ${p.offsetData}`;
    return await mySqlConnectAndQuery(query);
  }

  static async getUser(id) {
    const query = `SELECT * FROM ${UserModel.name} WHERE id = ?`;
    return await mySqlConnectAndQuery(query, id);
  }

  static async createUser(body) {
    const query = `INSERT INTO ${UserModel.name} (name, surname, email) VALUES (?, ?, ?)`;
    let newBody = [body.name, body.surname, body.email];
    if (newBody.includes(undefined)) {
      throw new Error("Body");
    }
    return await mySqlConnectAndQuery(query, newBody);
  }

  static async updateUser(currentData, body) {
    const query = `UPDATE ${UserModel.name} SET name = ?, surname = ?, email = ? WHERE id = ?`;
    let newBody = [
      body.name ?? currentData.name,
      body.surname ?? currentData.surname,
      body.email ?? currentData.email,
      currentData.id,
    ];
    return await mySqlConnectAndQuery(query, newBody);
  }

  static async deleteUser(id) {
    const query = `DELETE FROM ${UserModel.name} WHERE id = ?`;
    let deletedUser = await this.getUser(id);
    const result = await mySqlConnectAndQuery(query, id);
    return [result, deletedUser];
  }
}

module.exports = MySqlUserModel;
