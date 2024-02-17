const connectAndQuery = require("../../Core/Database");

class Goal {
  static tableName = "goal";

  static async getAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    return await connectAndQuery(query);
  }

  static async getGoal(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return await connectAndQuery(query, id);
  }

  static async createGoal(body) {
    const query = `INSERT INTO ${this.tableName} (title, description) VALUES (?,?)`;
    let newBody = [body.title, body.description];
    if (newBody.includes(undefined)) {
      throw new Error("Body");
    }
    return await connectAndQuery(query, newBody);
  }

  static async updateGoal(currentBody, body) {
    const query = `UPDATE ${this.tableName} SET title = ?, description = ? WHERE id = ?`;
    let newBody = [
      body.title ?? currentBody.title,
      body.description ?? currentBody.description,
      currentBody.id,
    ];
    return await connectAndQuery(query, newBody);
  }

  static async deleteGoal(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    let deletedGoal = await this.getGoal(id);
    const result = await connectAndQuery(query, id);
    return [result, deletedGoal];
  }
}

module.exports = Goal;
