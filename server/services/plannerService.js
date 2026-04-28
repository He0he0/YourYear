const Planner = require("../models/Planner");

const getPlanner = async (userId) => {
  let planner = await Planner.findOne({ userId });
  if (!planner) {
    planner = await Planner.create({ userId, years: [], clipboard: [] });
  }
  return planner;
};

const savePlanner = async (userId, { years, clipboard }) => {
  const planner = await Planner.findOneAndUpdate(
    { userId },
    { years, clipboard },
    { upsert: true, new: true }
  );
  return planner;
};

module.exports = { getPlanner, savePlanner };
