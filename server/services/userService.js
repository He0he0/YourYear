const User = require("../models/User");

const updateUser = async (userId, { name, email, major, structure }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, major, structure },
    { new: true, runValidators: true }
  );
  if (!user) throw new Error("User not found");
  return { id: user._id, name: user.name, email: user.email, major: user.major, structure: user.structure };
};

module.exports = { updateUser };
