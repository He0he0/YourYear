const User = require("../models/User");

const updateUser = async (userId, { name, email, major, minor, structure, university, startYear }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, major, minor, structure, university, startYear: startYear || null },
    { new: true, runValidators: true }
  );
  if (!user) throw new Error("User not found");
  return { id: user._id, name: user.name, email: user.email, major: user.major, minor: user.minor, structure: user.structure, university: user.university, startYear: user.startYear };
};

module.exports = { updateUser };
