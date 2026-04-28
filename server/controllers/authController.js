const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res) => {
  try {
    const { name, email, password, structure } = req.body;
    const { user, token } = await registerUser({ name, email, password, structure });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login };
