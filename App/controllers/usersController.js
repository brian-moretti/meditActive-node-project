const chooseModel = require("../../Core/utilities/chooseModel");

const user_index = async (req, res) => {
  try {
    const User = await chooseModel(req, "users");
    const result = await User.getAll(req.query);
    res.status(200).json({ Users: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

const user_details = async (req, res) => {
  try {
    const User = await chooseModel(req, "users");
    const result = await User.getUser(req.params.id);

    if (req.databaseModels["Mongo"] && result === null) {
      return res.status(404).json({ Error: "User not founded" });
    } else {
      if (result.length <= 0) {
        return res.status(404).json({ Error: "User not founded" });
      }
    }
    res.status(200).json({ User: result });
  } catch (error) {
    console.error(error);
    if (req.databaseModels["Mongo"] && error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const user_create = async (req, res) => {
  try {
    const User = await chooseModel(req, "users");
    const result = await User.createUser(req.body);
    if (req.databaseModels["Mongo"]) {
      res.status(201).json({ User: req.body });
    } else {
      res.status(201).json({ ID: result.insertId, User: req.body });
    }
    //res.redirect("/users");
  } catch (error) {
    console.error(error);
    if (req.databaseModels["Mongo"] && error.code === 121) {
      res
        .status(400)
        .json({ "Validation Error": "The body has an error, please check it" });
    } else {
      if (error.message === "Body") {
        res.status(400).json({ Error: "The body is not correct" });
      } else if (error.code === "ER_DUP_ENTRY") {
        res.status(400).json({ Error: "Email already exists" });
      } else {
        res.status(500).json({ Error: "Internal server errors" });
      }
    }
  }
};

const user_update = async (req, res) => {
  try {
    const User = await chooseModel(req, "users");
    let userToUpdate;

    if (req.databaseModels["Mongo"]) {
      userToUpdate = await User.getUser(req.params.id);
    } else {
      [userToUpdate] = await User.getUser(req.params.id);
    }
    const result = await User.updateUser(userToUpdate, req.body);

    if (req.databaseModels["Mongo"]) {
      if (result.modifiedCount >= 0) {
        res
          .status(200)
          .json({ "Update ID": userToUpdate._id, "User updated": req.body });
      }
    } else {
      if (result.affectedRows >= 1) {
        res
          .status(200)
          .json({ "Update ID": userToUpdate.id, "User updated": req.body });
      }
    }
  } catch (error) {
    console.error(error);
    if (req.databaseModels["Mongo"] && error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(400).json({ Error: "Email already exists" });
      } else {
        res.status(500).json({ Error: "Internal server errors" });
      }
    }
  }
};

const user_delete = async (req, res) => {
  try {
    const User = await chooseModel(req, "users");
    const [result, deletedUser] = await User.deleteUser(req.params.id);

    if (req.databaseModels["Mongo"]) {
      if (result.deletedCount <= 0) {
        return res.status(404).json({ Error: "User not founded" });
      }
    } else {
      if (result.affectedRows <= 0) {
        return res.status(404).json({ Error: "User not founded" });
      }
    }
    res.status(200).json({ "User deleted": deletedUser });
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
  user_index,
  user_details,
  user_create,
  user_update,
  user_delete,
};
