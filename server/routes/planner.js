const express = require("express");
const router = express.Router();
const { fetchPlanner, updatePlanner } = require("../controllers/plannerController");
const verifyToken = require("../middleware/auth");

router.get("/:userId", verifyToken, fetchPlanner);
router.put("/:userId", verifyToken, updatePlanner);

module.exports = router;
