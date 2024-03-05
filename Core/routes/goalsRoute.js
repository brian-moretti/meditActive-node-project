const express = require("express");
const routerGoals = express.Router();
const goalController = require("../../App/controllers/goalsController");

routerGoals.get("/", goalController.goal_index);
routerGoals.get("/:id", goalController.goal_details);
routerGoals.post("/", goalController.goal_create);
routerGoals.put("/:id", goalController.goal_update);
routerGoals.delete("/:id", goalController.goal_delete);

module.exports = routerGoals;
