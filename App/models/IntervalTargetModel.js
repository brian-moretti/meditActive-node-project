class IntervalTargetModel {
  static name = "interval_target";

  constructor() {
    if (this.constructor === IntervalTargetModel) {
      throw new Error("This is an abstract class, you can't initialize it");
    }
  }
  static async getAll() {
    throw new Error("This method must be implemented");
  }
  static async getIntervalTarget() {
    throw new Error("This method must be implemented");
  }
  static async createIntervalTarget() {
    throw new Error("This method must be implemented");
  }
  static async updateIntervalTarget() {
    throw new Error("This method must be implemented");
  }
  static async deleteIntervalTarget() {
    throw new Error("This method must be implemented");
  }
}

module.exports = IntervalTargetModel;
