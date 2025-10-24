const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const validateUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token !!!!!!!!!!");
    }

    const { _id } = jwt.verify(token, "secret_key");
    if (!_id) {
      throw new Error("Invvalid Token !!!!!!!!!!");
    }
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    } else {
      req.user = user;
      next();
    }
  } catch (e) {
    res.status(400).send(`Error: ${e.message}`);
  }
};

module.exports = { validateUser };
