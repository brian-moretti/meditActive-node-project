const IntervalTarget = require("../models/interval-target");

const intervalTarget_index = async (req, res) => {
  try {
    const result = await IntervalTarget.getAll(req.query);
    if (result.length <= 0 && Object.keys(req.query).length > 0) {
      return res
        .status(404)
        .json({ Message: "0 intervals has been founded with this params" });
    }
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
    if (error.message === "Id not valid") {
      res.status(400).json({ Error: "The Id has a format error" });
    } else {
      res.status(500).json({ Error: "Internal server errors" });
    }
  }
};

const intervalTarget_create = async (req, res) => {
  try {
    const result = await IntervalTarget.createIntervalTarget(req.body);
    res.status(201).json({ Interval: req.body });
    //res.redirect("/interval-target");
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

const intervalTarget_update = async (req, res) => {
  try {
    const [intervalToUpdate] = await IntervalTarget.getIntervalTarget(
      req.params.id
    );
    const result = await IntervalTarget.updateIntervalTarget(
      intervalToUpdate,
      req.body
    );
    if (result.modifiedCount >= 0) {
      res.status(200).json({
        "Update ID": intervalToUpdate._id,
        "Interval updated": req.body,
      });
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

const intervalTarget_delete = async (req, res) => {
  try {
    const [result, deletedInterval] = await IntervalTarget.deleteIntervalTarget(
      req.params.id
    );
    if (result.deletedCount <= 0) {
      return res.status(404).json({ Error: "Interval not founded" });
    }
    res.status(200).json({ "Interval deleted": deletedInterval });
    //res.redirect("/interval-target");
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
  intervalTarget_index,
  intervalTarget_details,
  intervalTarget_create,
  intervalTarget_update,
  intervalTarget_delete,
};
