const express = require("express");
const router = express.Router();
let cache = null;

router.get("/", async (req, res) => {
  try {
    if (!cache) {
      const response = await fetch(
        "https://universities.hipolabs.com/search?country=United+States"
      );
      const data = await response.json();
      cache = data.map((u) => u.name).sort();
    }
    res.json(cache);
  } catch (err) {
    cache = null;
    res.status(502).json({ message: "Failed to fetch university list" });
  }
});

module.exports = router;
