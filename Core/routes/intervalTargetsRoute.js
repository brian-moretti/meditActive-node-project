const express = require("express");
const routerIntervalTargets = express.Router();
const intervalTargetController = require("../../App/controllers/intervalTargetsController");

routerIntervalTargets.get("/", intervalTargetController.intervalTarget_index);
routerIntervalTargets.get("/:id", intervalTargetController.intervalTarget_details);
routerIntervalTargets.post("/", intervalTargetController.intervalTarget_create);
routerIntervalTargets.put("/:id", intervalTargetController.intervalTarget_update);
routerIntervalTargets.delete("/:id", intervalTargetController.intervalTarget_delete);

module.exports = routerIntervalTargets;
