const mySqlConnectAndQuery = require("../../../Core/Database");
const paginations = require("../../../utilities/useDatabase");
const GoalModel = require("../GoalModel");

class MySqlGoalModel extends GoalModel {
  constructor() {
    super();
  }

  static async getAll(params) {
    let p = paginations(params);
    const query = `SELECT * FROM ${GoalModel.name} LIMIT ${p.maxData} OFFSET ${p.offsetData}`;
    return await mySqlConnectAndQuery(query);
  }

  static async getGoal(id) {
    const query = `SELECT * FROM ${GoalModel.name} WHERE id = ?`;
    return await mySqlConnectAndQuery(query, id);
  }

  static async createGoal(body) {
    const query = `INSERT INTO ${GoalModel.name} (title, description) VALUES (?,?)`;
    let newBody = [body.title, body.description];
    if (newBody.includes(undefined)) {
      throw new Error("Body");
    }
    return await mySqlConnectAndQuery(query, newBody);
  }

  static async updateGoal(currentBody, body) {
    const query = `UPDATE ${GoalModel.name} SET title = ?, description = ? WHERE id = ?`;
    let newBody = [
      body.title ?? currentBody.title,
      body.description ?? currentBody.description,
      currentBody.id,
    ];
    return await mySqlConnectAndQuery(query, newBody);
  }

  static async deleteGoal(id) {
    const query = `DELETE FROM ${GoalModel.name} WHERE id = ?`;
    let deletedGoal = await this.getGoal(id);
    const result = await mySqlConnectAndQuery(query, id);
    return [result, deletedGoal];
  }
}

module.exports = MySqlGoalModel;
