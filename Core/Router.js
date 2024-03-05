const express = require("express");
const router = express.Router();
const routerUsers = require("./routes/usersRoute");
const routerIntervalTargets = require("./routes/intervalTargetsRoute");
const routerGoals = require("./routes/goalsRoute");

router
  .use("/users", routerUsers)
  .use("/interval-targets", routerIntervalTargets)
  .use("/goals", routerGoals);

module.exports = router;
