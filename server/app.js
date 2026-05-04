const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const plannerRoutes = require("./routes/planner");
const userRoutes = require("./routes/users");
const universitiesRoutes = require("./routes/universities");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());
app.use(express.json());


// Source - https://stackoverflow.com/a/55897146
// Posted by Shohel, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-28, License - CC BY-SA 4.0

app.use("/api/auth", authRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/universities", universitiesRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
