const express = require("express");
const router = express.Router();
const { update } = require("../controllers/userController");
const verifyToken = require("../middleware/auth");

router.patch("/:id", verifyToken, update);

module.exports = router;
