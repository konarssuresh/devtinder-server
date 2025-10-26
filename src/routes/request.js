const express = require("express");
const { validateUser } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", validateUser, async (req, res) => {
  res.send(
    `${req.user.firstName} ${req.user.lastName} is sending connection request`
  );
});

module.exports = requestRouter;
