class UserModel {
  static name = "users";

  constructor() {
    if (this.constructor === UserModel) {
      throw new Error("This is an abstract class, you can't initialize it");
    }
  }

  static async getAll() {
    throw new Error("This method must be implemented");
  }
  static async getUser() {
    throw new Error("This method must be implemented");
  }
  static async createUser() {
    throw new Error("This method must be implemented");
  }
  static async updateUser() {
    throw new Error("This method must be implemented");
  }
  static async deleteUser() {
    throw new Error("This method must be implemented");
  }
}

module.exports = UserModel