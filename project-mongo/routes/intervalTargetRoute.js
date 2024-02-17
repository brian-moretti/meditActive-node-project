const express = require("express");
const routerInterval = express.Router();
const intervalTargetController = require("../App/controllers/intervalTargetController");

routerInterval.get("/", intervalTargetController.intervalTarget_index);
routerInterval.get("/:id", intervalTargetController.intervalTarget_details);
routerInterval.post("/", intervalTargetController.intervalTarget_create);
routerInterval.put("/:id", intervalTargetController.intervalTarget_update);
routerInterval.delete("/:id", intervalTargetController.intervalTarget_delete);

module.exports = routerInterval;
