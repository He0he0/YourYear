const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  id:            { type: String, required: true },
  code:          { type: String, required: true },
  title:         { type: String, required: true },
  units:         { type: Number, default: null },
  description:   { type: String, default: '' },
  prerequisites: { type: String, default: '' },
  notes:         { type: String, default: '' },
  grade:         { type: String, default: '' },
});

const termSchema = new mongoose.Schema({
  id:      { type: String, required: true },
  name:    { type: String, required: true },
  courses: [courseSchema],
});

const yearSchema = new mongoose.Schema({
  id:    { type: String, required: true },
  label: { type: String, required: true },
  terms: [termSchema],
});

const plannerSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  years:     [yearSchema],
  clipboard: [courseSchema],
}, { timestamps: true });

module.exports = mongoose.model("Planner", plannerSchema);
