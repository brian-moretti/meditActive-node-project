const express = require("express");
const router = express.Router();
const routerUsers = require("../routes/userRoute");
const routerInterval = require("../routes/intervalTargetRoute");
const routerGoal = require("../routes/goalRoute");

router
  .use("/users", routerUsers)
  .use("/interval-target", routerInterval)
  .use("/goal", routerGoal);

module.exports = router;
