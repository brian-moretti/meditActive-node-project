const User = require("../models/user");

const user_index = async (req, res) => {
  try {
    const result = await User.getAll(req.query);
    res.status(200).json({ Users: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

const user_details = async (req, res) => {
  try {
    const result = await User.getUser(req.params.id);
    if (result.length <= 0) {
      return res.status(404).json({ Error: "User not founded" });
    }
    res.status(200).json({ User: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

const user_create = async (req, res) => {
  try {
    const result = await User.createUser(req.body);
    res.status(201).json({ ID: result.insertId, User: req.body });
    //res.redirect("/users");
  } catch (error) {
    console.error(error);
    if (error.message === "Body") {
      res.status(400).json({ Error: "The body is not correct" });
    } else if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ Error: "Email already exists" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const user_update = async (req, res) => {
  try {
    let [userToUpdate] = await User.getUser(req.params.id);
    const result = await User.updateUser(userToUpdate, req.body);

    if (result.affectedRows >= 1) {
      res
        .status(200)
        .json({ "Update ID": userToUpdate.id, "User updated": req.body });
    }
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ Error: "Email already exists" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const user_delete = async (req, res) => {
  try {
    const [result, deletedUser] = await User.deleteUser(req.params.id);
    if (result.affectedRows <= 0) {
      return res.status(404).json({ Error: "User not founded" });
    }
    res.status(200).json({ "User deleted": deletedUser });
    //res.redirect("/users");
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

module.exports = {
  user_index,
  user_details,
  user_create,
  user_update,
  user_delete,
};
