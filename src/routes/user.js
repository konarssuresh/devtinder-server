const express = require("express");
const { validateUser } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connection-request");

const userRouter = express.Router();

const USER_ALLOWED_FIELDS =
  "firstName lastName age gender skills photoUrl about";

userRouter.get("/user/requests/received", validateUser, async (req, res) => {
  try {
    let toUser = req.user;
    let data = await ConnectionRequest.find({
      toUserId: toUser._id,
      status: "interested",
    }).populate("fromUserId", USER_ALLOWED_FIELDS);

    res.json({ message: "Data retrieved successfully", data });
  } catch (e) {
    res.status(400).send(`Error - ${e?.message}`);
  }
});

userRouter.get("/user/connections", validateUser, async (req, res) => {
  try {
    let loggedInUser = req.user;

    let requestsData = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser?._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_ALLOWED_FIELDS)
      .populate("toUserId", USER_ALLOWED_FIELDS);

    let data = requestsData.map((req) => {
      if (req.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return req.toUserId;
      }
      return req.fromUserId;
    });

    res.send(data);
  } catch (e) {
    res.status(400).send(`Error - ${e?.message}`);
  }
});

module.exports = userRouter;
