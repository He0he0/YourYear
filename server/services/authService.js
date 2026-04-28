const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async ({ name, email, password, structure }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: passwordHash, structure });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    user: { id: user._id, name: user.name, email: user.email, structure: user.structure, major: user.major },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    user: { id: user._id, name: user.name, email: user.email, structure: user.structure, major: user.major },
    token,
  };
};

module.exports = { registerUser, loginUser };
