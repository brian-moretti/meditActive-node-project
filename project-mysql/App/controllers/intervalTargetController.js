const IntervalTarget = require("../models/interval-target");

const intervalTarget_index = async (req, res) => {
  try {
    const result = await IntervalTarget.getAll(req.query);
    res.status(200).json({ Interval: result });
  } catch (error) {
    console.error(error);
    if (error.message === "Date") {
      res
        .status(400)
        .json({ "Date Error": "There is an error on the Date, please check" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const intervalTarget_details = async (req, res) => {
  try {
    const result = await IntervalTarget.getIntervalTarget(req.params.id);
    if (result.length <= 0) {
      return res.status(404).json({ Error: "Interval not founded" });
    }
    res.status(200).json({ Interval: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

const intervalTarget_create = async (req, res) => {
  try {
    const result = await IntervalTarget.createIntervalTarget(req.body);
    res.status(201).json({ ID: result.insertId, Interval: req.body });
    //res.redirect("/interval-target");
  } catch (error) {
    console.error(error);
    if (error.message === "Body") {
      res.status(400).json({ Error: "The body is not correct" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const intervalTarget_update = async (req, res) => {
  try {
    const [intervalToUpdate] = await IntervalTarget.getIntervalTarget(
      req.params.id
    );
    const result = await IntervalTarget.updateIntervalTarget(
      intervalToUpdate,
      req.body
    );
    if (result.affectedRows >= 1) {
      res.status(200).json({
        "Update ID": intervalToUpdate.id,
        "Interval updated": req.body,
      });
    }
  } catch (error) {
    console.error(error);
    if (error.message === "Body") {
      res.status(400).json({ Error: "The body is not correct" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const intervalTarget_delete = async (req, res) => {
  try {
    const [result, deletedInterval] = await IntervalTarget.deleteIntervalTarget(
      req.params.id
    );
    if (result.affectedRows <= 0) {
      return res.status(404).json({ Error: "Interval not founded" });
    }
    res.status(200).json({ "Interval Target Deleted": deletedInterval });
    //res.redirect("/interval-target");
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server errors" });
  }
};

module.exports = {
  intervalTarget_index,
  intervalTarget_details,
  intervalTarget_create,
  intervalTarget_update,
  intervalTarget_delete,
};
