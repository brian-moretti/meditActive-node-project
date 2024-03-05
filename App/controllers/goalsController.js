const chooseModel = require("../../Core/utilities/chooseModel");

const goal_index = async (req, res) => {
  try {
    const Goal = await chooseModel(req, "goals");
    const result = await Goal.getAll(req.query);
    res.status(200).json({ Goal: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

const goal_details = async (req, res) => {
  try {
    const Goal = await chooseModel(req, "goals");
    const result = await Goal.getGoal(req.params.id);
    if (req.databaseModels["Mongo"] && result === null) {
      return res.status(404).json({ Error: "Goal not founded" });
    } else {
      if (result.length <= 0) {
        return res.status(404).json({ Error: "Goal not founded" });
      }
    }
    res.status(200).json({ Goal: result });
  } catch (error) {
    console.error(error);
    if (req.databaseModels["Mongo"] && error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const goal_create = async (req, res) => {
  try {
    const Goal = await chooseModel(req, "goals");
    const result = await Goal.createGoal(req.body);
    if (req.databaseModels["Mongo"]) {
      res.status(201).json({ Goal: req.body });
    } else {
      res.status(201).json({ ID: result.insertId, Goal: req.body });
    }
  } catch (error) {
    console.error(error);
    if (req.databaseModels["Mongo"] && error.code === 121) {
      res
        .status(400)
        .json({ "Validation Error": "The body has an error, please check it" });
    } else {
      if (error.message === "Body") {
        res.status(400).json({ Error: "The body is not correct" });
      } else {
        res.status(500).json({ Error: "Internal server errors" });
      }
    }
  }
};

const goal_update = async (req, res) => {
  try {
    const Goal = await chooseModel(req, "goals");
    let goalToUpdate;
    if (req.databaseModels["Mongo"]) {
      goalToUpdate = await Goal.getGoal(req.params.id);
    } else {
      [goalToUpdate] = await Goal.getGoal(req.params.id);
    }
    const result = await Goal.updateGoal(goalToUpdate, req.body);

    if (req.databaseModels["Mongo"]) {
      if (result.modifiedCount >= 0) {
        res
          .status(200)
          .json({ "Update ID": goalToUpdate._id, "Goal updated": req.body });
      }
    } else {
      if (result.affectedRows >= 1) {
        res
          .status(200)
          .json({ "Update ID": goalToUpdate.id, "Goal updated": req.body });
      }
    }
  } catch (error) {
    console.error(error);
    if (req.databaseModels["Mongo"] && error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const goal_delete = async (req, res) => {
  try {
    const Goal = await chooseModel(req, "goals");
    const [result, deletedGoal] = await Goal.deleteGoal(req.params.id);

    if (req.databaseModels["Mongo"]) {
      if (result.deletedCount <= 0) {
        return res.status(404).json({ Error: "Goal not founded" });
      }
    } else {
      if (result.affectedRows <= 0) {
        return res.status(404).json({ Error: "Goal not founded" });
      }
    }
    res.status(200).json({ "Goal deleted": deletedGoal });
    //res.redirect("/users");
  } catch (error) {
    console.error(error);
    if (req.databaseModels["Mongo"] && error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

module.exports = {
  goal_index,
  goal_details,
  goal_create,
  goal_update,
  goal_delete,
};
