const connectAndQuery = require("../../Core/Database");

class User {
  static tableName = "users";

  static async getAll(params) {
    const page = params.page || 0;
    const maxUsers = 5;
    const offsetData = page == 1 ? 0 : (page - 1) * maxUsers;
    const query = `SELECT * FROM ${this.tableName} LIMIT ${maxUsers} OFFSET ${offsetData}`;
    return await connectAndQuery(query);
  }

  static async getUser(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return await connectAndQuery(query, id);
  }

  static async createUser(body) {
    const query = `INSERT INTO ${User.tableName} (name, surname, email) VALUES (?, ?, ?)`;
    let newBody = [body.name, body.surname, body.email];
    if (newBody.includes(undefined)) {
      throw new Error("Body");
    }
    return await connectAndQuery(query, newBody);
  }

  static async updateUser(currentData, body) {
    const query = `UPDATE ${User.tableName} SET name = ?, surname = ?, email = ? WHERE id = ?`;
    let newBody = [
      body.name ?? currentData.name,
      body.surname ?? currentData.surname,
      body.email ?? currentData.email,
      currentData.id,
    ];
    return await connectAndQuery(query, newBody);
  }

  static async deleteUser(id) {
    const query = `DELETE FROM ${User.tableName} WHERE id = ?`;
    let deletedUser = await this.getUser(id);
    const result = await connectAndQuery(query, id);
    return [result, deletedUser];
  }
}

module.exports = User;
