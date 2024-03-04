class GoalModel {
  static name = "goal";

  constructor() {
    if (this.constructor === GoalModel) {
      throw new Error("This is an abstract class, you can't initialize it");
    }
  }
  static async getAll() {
    throw new Error("This method must be implemented");
  }
  static async getGoal() {
    throw new Error("This method must be implemented");
  }
  static async createGoal() {
    throw new Error("This method must be implemented");
  }
  static async updateGoal() {
    throw new Error("This method must be implemented");
  }
  static async deleteGoal() {
    throw new Error("This method must be implemented");
  }
}

module.exports = GoalModel;
