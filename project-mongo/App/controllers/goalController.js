const Goal = require("../models/goal");

const goal_index = async (req, res) => {
  try {
    const result = await Goal.getAll();
    res.status(200).json({ Goals: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

const goal_details = async (req, res) => {
  try {
    const result = await Goal.getGoal(req.params.id);
    if (result === null) {
      return res.status(404).json({ Error: "Goal not founded" });
    }
    res.status(200).json({ Goal: result });
  } catch (error) {
    console.error(error);
    if (error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const goal_create = async (req, res) => {
  try {
    await Goal.createGoal(req.body);
    res.status(201).json({ Goal: req.body });
  } catch (error) {
    console.error(error);
    if (error.code === 121) {
      res
        .status(400)
        .json({ "Validation Error": "The body has an error, please check it" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const goal_update = async (req, res) => {
  try {
    let goalToUpdate = await Goal.getGoal(req.params.id);
    const result = await Goal.updateGoal(goalToUpdate, req.body);
    if (result.modifiedCount >= 0) {
      res
        .status(200)
        .json({ "Update ID": goalToUpdate._id, "Goal updated": req.body });
    }
  } catch (error) {
    console.error(error);
    if (error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const goal_delete = async (req, res) => {
  try {
    const [result, deletedGoal] = await Goal.deleteGoal(req.params.id);
    if (result.deletedCount <= 0) {
      return res.status(404).json({ Error: "Goal not founded" });
    }
    res.status(200).json({ "Goal deleted": deletedGoal });
  } catch (error) {
    console.error(error);
    if (error.message === "Id not valid") {
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