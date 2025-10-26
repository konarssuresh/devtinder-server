const express = require("express");
const bcrypt = require("bcrypt");

const {
  validateSignupData,
  validateKeys,
  validateLoginData,
} = require("../utils/validators");
const { User } = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const ALLOWED_KEYS = ["firstName", "lastName", "emailId", "password"];

  try {
    validateSignupData(req);
    validateKeys(req, ALLOWED_KEYS);
    const { password, firstName, lastName, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    let { emailId, password } = req.body;
    let user = await User.findOne({ emailId });
    if (user) {
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const jwtToken = user.getJWT();
        res.cookie("token", jwtToken);
        res.send("login successful");
      } else {
        res.status(400).send("invalid emailid or password");
      }
    } else {
      res.status(400).send("invalid emailid or password");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful");
});

module.exports = authRouter;
