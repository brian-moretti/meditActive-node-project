const express = require("express");
const routerUsers = express.Router();
const usersController = require("../../App/controllers/usersController");

routerUsers.get("/", usersController.user_index);
routerUsers.get("/:id", usersController.user_details);
routerUsers.post("/", usersController.user_create);
routerUsers.put("/:id", usersController.user_update);
routerUsers.delete("/:id", usersController.user_delete);

module.exports = routerUsers;
