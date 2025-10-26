const express = require("express");
const bcrypt = require("bcrypt");

const { validateUser } = require("../middlewares/auth");
const {
  validateUpdateprofile,
  validatePassword,
} = require("../utils/validators");

const profileRouter = express.Router();

profileRouter.get("/profile/view", validateUser, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

profileRouter.patch("/profile/edit", validateUser, async (req, res) => {
  try {
    validateUpdateprofile(req);

    let user = req.user;

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

profileRouter.patch("/profile/password", validateUser, async (req, res) => {
  try {
    validatePassword(req);
    let user = req.user;
    let newPasswordHash = await bcrypt.hash(req.body.password, 10);
    user.password = newPasswordHash;

    await user.save();
    res.send("Password updated !!!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = profileRouter;
