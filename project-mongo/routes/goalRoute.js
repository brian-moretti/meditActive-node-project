const express = require("express");
const routerGoal = express.Router();
const goalController = require("../App/controllers/goalController");

routerGoal.get("/", goalController.goal_index);
routerGoal.get("/:id", goalController.goal_details);
routerGoal.post("/", goalController.goal_create);
routerGoal.put("/:id", goalController.goal_update);
routerGoal.delete("/:id", goalController.goal_delete);

module.exports = routerGoal;
