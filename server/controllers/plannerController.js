const { getPlanner, savePlanner } = require("../services/plannerService");

const fetchPlanner = async (req, res) => {
  try {
    const planner = await getPlanner(req.params.userId);
    res.status(200).json(planner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePlanner = async (req, res) => {
  try {
    const planner = await savePlanner(req.params.userId, req.body);
    res.status(200).json(planner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { fetchPlanner, updatePlanner };
