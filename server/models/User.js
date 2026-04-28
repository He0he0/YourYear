const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  major:     { type: String, default: '' },
  structure: { type: String, enum: ['semester', 'quarter'], required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
