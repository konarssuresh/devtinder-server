const express = require("express");

const { validateUser } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", validateUser, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

module.exports = profileRouter;
