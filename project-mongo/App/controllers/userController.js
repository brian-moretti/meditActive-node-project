const User = require("../models/user");

const user_index = async (req, res) => {
  try {
    const result = await User.getAll(req.params);
    res.status(200).json({ Users: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

const user_details = async (req, res) => {
  try {
    const result = await User.getUser(req.params.id);
    if (result === null) {
      return res.status(404).json({ Error: "User not founded" });
    }
    res.status(200).json({ User: result });
  } catch (error) {
    console.error(error);
    if (error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const user_create = async (req, res) => {
  try {
    await User.createUser(req.body);
    res.status(201).json({ User: req.body });
    //res.redirect("/users");
  } catch (error) {
    console.error(error);
    if (error.code === 121) {
      res
        .status(400)
        .json({ "Validation Error": "The body has an error, please check it" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const user_update = async (req, res) => {
  try {
    let userToUpdate = await User.getUser(req.params.id);
    const result = await User.updateUser(userToUpdate, req.body);
    //? OCCHIO ALLA CONDIZIONE
    if (result.modifiedCount >= 0) {
      res
        .status(200)
        .json({ "Update ID": userToUpdate._id, "User updated": req.body });
    }
  } catch (error) {
    console.error(error);
    if (error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const user_delete = async (req, res) => {
  try {
    const [result, deletedUser] = await User.deleteUser(req.params.id);
    if (result.deletedCount <= 0) {
      return res.status(404).json({ Error: "User not founded" });
    }
    res.status(200).json({ "User deleted": deletedUser });
    //res.redirect("/users");
  } catch (error) {
    console.error(error);
    if (error.message === "Id not valid") {
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
