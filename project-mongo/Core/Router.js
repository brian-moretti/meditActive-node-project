const express = require("express");
const routerUsers = require("../routes/userRoute");
const routerInterval = require("../routes/intervalTargetRoute");
const routerGoal = require("../routes/goalRoute");
const router = express.Router();

router
  .use("/users", routerUsers)
  .use("/interval-targets", routerInterval)
  .use("/goals", routerGoal);

module.exports = router;
